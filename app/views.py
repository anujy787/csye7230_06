from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer, TravelPlanSerializer
from .models import User, TravelPlan, VerificationToken
import bcrypt
from rest_framework.authentication import BaseAuthentication
import base64
import datetime
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import os

# from django.core.mail import send_mail
import re
from django.utils.dateparse import parse_datetime


# Create your views here.


@login_required
def home(request):
    return render(request, "home.html")


def login(request):
    return render(request, "login.html")


class RegisterView(APIView):
    def post(self, request):
        if request.query_params:
            return Response({"error": "Query parameters not allowed"})
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        verification_token = VerificationToken.create_token(user)
        if os.getenv("CI") == "true":
            print("Mail Not Sent Since Env is : CI")
        else:
            from mailing import send_verification_email

            send_verification_email(request.data.get("email"), verification_token)
        return Response(serializer.data, status=201)

    def handle_bad_request(self):
        return Response({"error": "Bad Request"}, status=400)

    def get(self, request):
        return self.handle_bad_request()

    def put(self, request):
        return self.handle_bad_request()

    def delete(self, request):
        return self.handle_bad_request()

    def options(self, request, *args, **kwargs):
        return Response(status=405, headers={"Allow": "GET"})


class BasicAuthHeaderAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Basic "):
            return None

        auth_data = auth_header.split(" ")[1]
        try:
            auth_data = base64.b64decode(auth_data).decode("utf-8")
            username, password = auth_data.split(":", 1)
        except (UnicodeDecodeError, ValueError):
            return None

        return self.authenticate_credentials(username, password)

    def authenticate_credentials(self, username, password):

        if re.match(r"[^@]+@[^@]+\.[^@]+", username):
            user = User.objects.filter(email=username).first()
        else:
            user = User.objects.filter(username=username).first()

        # user = User.objects.filter(email=username).first()
        if user is None:
            raise AuthenticationFailed("User not found!")
        if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
            raise AuthenticationFailed("Incorrect password!")
        return (user, None)


class LoginView(APIView):
    authentication_classes = [BasicAuthHeaderAuthentication]

    def get(self, request):
        user = request.user

        if request.query_params:
            return Response({"error": "Query parameters not allowed"}, status=400)

        if request.data:
            return Response({"error": "Request body not allowed"}, status=400)

        if user.is_authenticated and user.is_verified:
            serializer = UserSerializer(user)
            return Response(data=serializer.data)
        elif user.is_verified == False:
            raise AuthenticationFailed("User not validated!")
        else:
            raise AuthenticationFailed("User not authenticated!")

    def put(self, request):
        user = request.user

        if user.is_authenticated and user.is_verified:
            data = request.data

            allowed_fields = ["first_name", "last_name", "password", "username", "bio", "is_subscribed"]
            for field in allowed_fields:
                if field in data:
                    if isinstance(data[field], str) and not data[field].strip():
                        return Response({"error": f"{field} cannot be blank"}, status=400)
                    elif isinstance(data[field], bool):
                        setattr(user, field, data[field])
                    else:
                        setattr(user, field, data[field])

            for field in data:
                if field not in allowed_fields:
                    return Response({"error": "Bad Request"}, status=400)

                if field == "first_name":
                    user.first_name = data["first_name"]
                elif field == "last_name":
                    user.last_name = data["last_name"]
                elif field == "username":
                    user.username = data["username"]
                elif field == "bio":
                    user.bio = data["bio"]
                elif field == "is_subscribed":
                    user.is_subscribed = bool(data["is_subscribed"])
                elif field == "password":
                    hashed_password = bcrypt.hashpw(
                        data["password"].encode("utf-8"), bcrypt.gensalt()
                    )
                    user.password = hashed_password.decode("utf-8")

            user.account_updated = datetime.datetime.now()
            user.save()
            return Response(
                {"message": "User details updated successfully!"}, status=204
            )
        elif user.is_verified == False:
            raise AuthenticationFailed("User not Validated!")
        else:
            raise AuthenticationFailed("User not authenticated!")


    def options(self, request, *args, **kwargs):
        return Response(status=405, headers={"Allow": "GET"})


class TravelPlanCreateView(APIView):
    authentication_classes = [BasicAuthHeaderAuthentication]

    def post(self, request):
        
        if request.query_params:
            return Response({"error": "Query parameters not allowed"}, status=400)

        user = request.user

        if user.is_authenticated:

            plan_data = {
                "created_by": request.user.id,
                "planned_date": request.data.get("planned_date"),
                "name": request.data.get("name"),
                "source": request.data.get("source"),
                "destination": request.data.get("destination"),
                "preference": request.data.get("preference"),
                "status": request.data.get("status", "new"),
                "link_to_map": request.data.get("link_to_map"),
                "created_at": (
                    parse_datetime(request.data.get("created_at"))
                    if request.data.get("created_at")
                    else None
                ),
                "updated_at": (
                    parse_datetime(request.data.get("updated_at"))
                    if request.data.get("updated_at")
                    else None
                ),
            }
            serializer = TravelPlanSerializer(data=plan_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            else:
                return Response(serializer.errors, status=400)

    def handle_bad_request(self):
        return Response({"error": "Bad Request"}, status=400)

    def get(self, request):
        return self.handle_bad_request()

    def put(self, request):
        return self.handle_bad_request()

    def delete(self, request):
        return self.handle_bad_request()

    def options(self, request, *args, **kwargs):
        return Response(status=405, headers={"Allow": "GET"})


class TravelPlanUpdateView(APIView):
    authentication_classes = [BasicAuthHeaderAuthentication]

    def get(self, request):

        user = request.user

        if request.query_params:
            return Response({"error": "Query parameters not allowed"}, status=400)

        if request.data:
            return Response({"error": "Request body not allowed"}, status=400)

        if user.is_authenticated:
            plans = TravelPlan.objects.filter(created_by=user.id)
            serializer = TravelPlanSerializer(plans, many=True)
            return Response(serializer.data)
        else:
            raise AuthenticationFailed("User not authenticated!")

    def put(self, request, pk):
        try:
            travel_plan = TravelPlan.objects.get(pk=pk)
        except TravelPlan.DoesNotExist:
            return Response(
                {"error": f"Travel plan with id {pk} does not exist"}, status=404
            )

        serializer = TravelPlanSerializer(travel_plan, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)

    def delete(self, request):
        pass


class AllTravelPlansView(APIView):
    authentication_classes = [BasicAuthHeaderAuthentication]

    def get(self, request):
        user = request.user

        if request.query_params:
            return Response({"error": "Query parameters not allowed"}, status=400)

        if user.is_authenticated:
            plans = TravelPlan.objects.all()
            serializer = TravelPlanSerializer(plans, many=True)
            return Response(serializer.data)
        else:
            raise AuthenticationFailed("User not authenticated!")

    def handle_bad_request(self):
        return Response({"error": "Bad Request"}, status=400)

    def post(self, request):
        return self.handle_bad_request()

    def put(self, request):
        return self.handle_bad_request()

    def delete(self, request):
        return self.handle_bad_request()

    def options(self, request, *args, **kwargs):
        return Response(status=405, headers={"Allow": "GET"})
