from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer, TravelPlanSerializer, TripSerializer
from .models import User, TravelPlan, VerificationToken, Trip
import bcrypt
from rest_framework.authentication import BaseAuthentication
import base64
import datetime
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import os
from django.conf import settings

# from django.core.mail import send_mail
import re
from django.utils.dateparse import parse_datetime
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Create your views here.


@login_required
def home(request):
    return render(request, "home.html")


def login(request):
    return render(request, "login.html")


class RegisterView(APIView):
    @swagger_auto_schema(
        request_body=UserSerializer,
        responses={
            201: "Successful registration. Returns user data.",
            400: "Bad request. Check request data.",
        },
        operation_summary="Register new user",
        operation_description="Register a new user with email verification.",
    )
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

    @swagger_auto_schema(
        responses={
            400: "Bad request. This endpoint does not support GET requests.",
        },
        operation_summary="Handle bad request",
        operation_description="This endpoint does not support GET requests.",
    )
    def get(self, request):
        return self.handle_bad_request()

    @swagger_auto_schema(
        responses={
            400: "Bad request. This endpoint does not support PUT requests.",
        },
        operation_summary="Handle bad request",
        operation_description="This endpoint does not support PUT requests.",
    )
    def put(self, request):
        return self.handle_bad_request()

    @swagger_auto_schema(
        responses={
            400: "Bad request. This endpoint does not support DELETE requests.",
        },
        operation_summary="Handle bad request",
        operation_description="This endpoint does not support DELETE requests.",
    )
    def delete(self, request):
        return self.handle_bad_request()

    @swagger_auto_schema(
        responses={
            405: "Method not allowed. Only GET method is supported.",
        },
        operation_summary="Handle method not allowed",
        operation_description="Only GET method is supported for this endpoint.",
    )
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

    @swagger_auto_schema(
        operation_summary="Get user details",
        operation_description="Retrieve authenticated user details if user is verified.",
        responses={
            200: "User details retrieved successfully.",
            401: "User not authenticated or not verified.",
        },
    )
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
            raise AuthenticationFailed("User not Validated. Please Check Your Mail!")
        else:
            raise AuthenticationFailed("User not authenticated!")

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "first_name": openapi.Schema(
                    type=openapi.TYPE_STRING, description="First name of the user"
                ),
                "last_name": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Last name of the user"
                ),
                "username": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Username of the user"
                ),
                "bio": openapi.Schema(
                    type=openapi.TYPE_STRING, description="User biography"
                ),
                "is_subscribed": openapi.Schema(
                    type=openapi.TYPE_BOOLEAN, description="Subscription status"
                ),
                "password": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_PASSWORD,
                    description="User password",
                ),
            },
            required=["first_name", "last_name", "username", "password"],
        ),
        operation_summary="Update user details",
        operation_description="Update authenticated user details if user is verified.",
        responses={
            204: "User details updated successfully.",
            400: "Bad request. Check request data.",
            401: "User not authenticated or not verified.",
        },
    )
    def put(self, request):
        user = request.user

        if user.is_authenticated and user.is_verified:
            data = request.data

            allowed_fields = [
                "first_name",
                "last_name",
                "password",
                "username",
                "bio",
                "is_subscribed",
            ]
            for field in allowed_fields:
                if field in data:
                    if isinstance(data[field], str) and not data[field].strip():
                        return Response(
                            {"error": f"{field} cannot be blank"}, status=400
                        )
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
            raise AuthenticationFailed("User not Validated. Please Check Your Mail!")
        else:
            raise AuthenticationFailed("User not authenticated!")

    @swagger_auto_schema(
        responses={
            405: "Method not allowed. Only GET method is supported.",
        },
        operation_summary="Handle method not allowed",
        operation_description="Only GET method is supported for this endpoint.",
    )
    def options(self, request, *args, **kwargs):
        return Response(status=405, headers={"Allow": "GET"})


class TravelPlanCreateView(APIView):
    authentication_classes = [BasicAuthHeaderAuthentication]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "planned_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    description="Planned date of the travel plan (YYYY-MM-DD)",
                ),
                "name": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Name of the travel plan"
                ),
                "source": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Source location of the travel plan",
                ),
                "destination": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Destination location of the travel plan",
                ),
                "preference": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Preference for the travel plan",
                ),
                "status": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Status of the travel plan",
                    enum=["new", "approved", "rejected"],
                ),
                "link_to_map": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Link to map for the travel plan",
                ),
                "created_at": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATETIME,
                    description="Creation timestamp of the travel plan (optional)",
                ),
                "updated_at": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATETIME,
                    description="Update timestamp of the travel plan (optional)",
                ),
            },
            required=["planned_date", "name", "source", "destination"],
        ),
        operation_summary="Create a new travel plan",
        operation_description="Create a new travel plan with specified details.",
        responses={
            201: "Travel plan created successfully.",
            400: "Bad request. Check request data.",
            401: "User not authenticated or not verified.",
        },
    )
    def post(self, request):

        if request.query_params:
            return Response({"error": "Query parameters not allowed"}, status=400)

        user = request.user

        if user.is_authenticated and user.is_verified:

            plan_data = {
                "created_by": user.first_name + " " + user.last_name,
                "user_uuid": user.id,
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
        elif user.is_verified == False:
            raise AuthenticationFailed("User not Validated. Please Check Your Mail!")
        else:
            raise AuthenticationFailed("User not authenticated!")

    def handle_bad_request(self):
        return Response({"error": "Bad Request"}, status=400)

    @swagger_auto_schema(
        responses={
            400: "Bad request. This endpoint does not support GET requests.",
            401: "User not authenticated or not verified.",
        },
        operation_summary="Handle bad request",
        operation_description="This endpoint does not support GET requests.",
    )
    def get(self, request):
        return self.handle_bad_request()

    @swagger_auto_schema(
        responses={
            400: "Bad request. This endpoint does not support PUT requests.",
            401: "User not authenticated or not verified.",
        },
        operation_summary="Handle bad request",
        operation_description="This endpoint does not support PUT requests.",
    )
    def put(self, request):
        return self.handle_bad_request()

    @swagger_auto_schema(
        responses={
            400: "Bad request. This endpoint does not support DELETE requests.",
            401: "User not authenticated or not verified.",
        },
        operation_summary="Handle bad request",
        operation_description="This endpoint does not support DELETE requests.",
    )
    def delete(self, request):
        return self.handle_bad_request()

    @swagger_auto_schema(
        responses={
            405: "Method not allowed. Only GET method is supported.",
        },
        operation_summary="Handle method not allowed",
        operation_description="Only GET method is supported for this endpoint.",
    )
    def options(self, request, *args, **kwargs):
        return Response(status=405, headers={"Allow": "GET"})


class TravelPlanUpdateView(APIView):
    authentication_classes = [BasicAuthHeaderAuthentication]

    @swagger_auto_schema(
        responses={
            200: "List of travel plans retrieved successfully.",
            400: "Bad request. Check request data.",
            401: "User not authenticated or not verified.",
        },
        operation_summary="Get user's travel plans",
        operation_description="Retrieve authenticated user's travel plans if user is verified.",
    )
    def get(self, request):

        user = request.user

        if request.query_params:
            return Response({"error": "Query parameters not allowed"}, status=400)

        if request.data:
            return Response({"error": "Request body not allowed"}, status=400)

        if user.is_authenticated and user.is_verified:
            plans = TravelPlan.objects.filter(user_uuid=user.id)
            serializer = TravelPlanSerializer(plans, many=True)
            return Response(serializer.data)
        elif user.is_verified == False:
            raise AuthenticationFailed("User not Validated. Please Check Your Mail!")
        else:
            raise AuthenticationFailed("User not authenticated!")

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "pk",
                openapi.IN_PATH,
                type=openapi.TYPE_INTEGER,
                description="ID of the travel plan to update",
                required=True,
            ),
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "planned_date": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATE,
                    description="Updated planned date of the travel plan (YYYY-MM-DD)",
                ),
                "name": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Updated name of the travel plan",
                ),
                "source": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Updated source location of the travel plan",
                ),
                "destination": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Updated destination location of the travel plan",
                ),
                "preference": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Updated preference for the travel plan",
                ),
                "status": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Updated status of the travel plan",
                    enum=["new", "approved", "rejected"],
                ),
                "link_to_map": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Updated link to map for the travel plan",
                ),
                "created_at": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATETIME,
                    description="Updated creation timestamp of the travel plan (optional)",
                ),
                "updated_at": openapi.Schema(
                    type=openapi.TYPE_STRING,
                    format=openapi.FORMAT_DATETIME,
                    description="Updated update timestamp of the travel plan (optional)",
                ),
            },
            required=["planned_date", "name", "source", "destination"],
        ),
        responses={
            200: "Travel plan updated successfully.",
            400: "Bad request. Check request data.",
            404: "Travel plan not found.",
        },
        operation_summary="Update a travel plan",
        operation_description="Update an existing travel plan with specified details.",
    )
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

    @swagger_auto_schema(
        responses={
            405: "Method not allowed. Only GET and PUT methods are supported.",
        },
        operation_summary="Handle method not allowed",
        operation_description="Only GET and PUT methods are supported for this endpoint.",
    )
    def delete(self, request):
        pass


class AllTravelPlansView(APIView):
    authentication_classes = [BasicAuthHeaderAuthentication]

    @swagger_auto_schema(
        responses={
            200: "List of all travel plans retrieved successfully.",
            400: "Bad request. Query parameters not allowed.",
            401: "User not authenticated or not verified.",
        },
        operation_summary="Get all travel plans",
        operation_description="Retrieve all travel plans if user is authenticated and verified.",
    )
    def get(self, request):
        user = request.user

        if request.query_params:
            return Response({"error": "Query parameters not allowed"}, status=400)

        if user.is_authenticated and user.is_verified:
            plans = TravelPlan.objects.all()
            serializer = TravelPlanSerializer(plans, many=True)
            return Response(serializer.data)
        elif user.is_verified == False:
            raise AuthenticationFailed("User not Validated. Please Check Your Mail!")
        else:
            raise AuthenticationFailed("User not authenticated!")

    def handle_bad_request(self):
        return Response({"error": "Bad Request"}, status=400)

    @swagger_auto_schema(
        responses={
            400: "Bad request. This endpoint does not support POST requests.",
            401: "User not authenticated or not verified.",
        },
        operation_summary="Handle bad request",
        operation_description="This endpoint does not support POST requests.",
    )
    def post(self, request):
        return self.handle_bad_request()

    @swagger_auto_schema(
        responses={
            400: "Bad request. This endpoint does not support PUT requests.",
            401: "User not authenticated or not verified.",
        },
        operation_summary="Handle bad request",
        operation_description="This endpoint does not support PUT requests.",
    )
    def put(self, request):
        return self.handle_bad_request()

    @swagger_auto_schema(
        responses={
            400: "Bad request. This endpoint does not support DELETE requests.",
            401: "User not authenticated or not verified.",
        },
        operation_summary="Handle bad request",
        operation_description="This endpoint does not support DELETE requests.",
    )
    def delete(self, request):
        return self.handle_bad_request()

    @swagger_auto_schema(
        responses={
            405: "Method not allowed. Only GET method is supported.",
        },
        operation_summary="Handle method not allowed",
        operation_description="Only GET method is supported for this endpoint.",
    )
    def options(self, request, *args, **kwargs):
        return Response(status=405, headers={"Allow": "GET"})


class AddUserToPlanView(APIView):
    authentication_classes = [BasicAuthHeaderAuthentication]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "plan": openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="ID of the travel plan to add trip to",
                ),
            },
            required=["plan"],
        ),
        responses={
            200: "Trip added successfully.",
            400: "Bad request. Check request data.",
            401: "User not authenticated or not verified.",
            404: "Travel plan does not exist.",
        },
        operation_summary="Add trip to a travel plan",
        operation_description="Add a trip to an existing travel plan.",
    )
    def post(self, request):
        if request.query_params:
            return Response({"error": "Query parameters not allowed"})

        user = request.user

        if user.is_authenticated and user.is_verified:
            plan = TravelPlan.objects.get(plan_id=request.data["plan"])
            req_user = UserSerializer(user).data
            plan_detail = TravelPlanSerializer(plan).data
            plan_name = plan_detail["name"]
            owner_uuid = plan_detail["user_uuid"]
            owner = User.objects.get(id=owner_uuid)
            owner_email = UserSerializer(owner).data["email"]
            data = {"plan": request.data["plan"], "user": req_user["id"]}
            plan_id = int(request.data["plan"])
            req_user_id = req_user["id"]
            if os.getenv("CI") == "true":
                print("Mail Not Sent Since Env is : CI")
            else:
                from mailing import send_trip_invite

                send_trip_invite(
                    owner_email, plan_name, user.email, plan_id, req_user_id
                )
            trip_serializer = TripSerializer(data=data)
            trip_serializer.is_valid(raise_exception=True)
            trip_serializer.save()
            return Response(trip_serializer.data)
        elif user.is_verified == False:
            raise AuthenticationFailed("User not Validated. Please Check Your Mail!")
        else:
            raise AuthenticationFailed("User not authenticated!")

    def get(self, request):
        if request.query_params:
            return Response({"error": "Query parameters not allowed"})

        user = request.user

        if user.is_authenticated and user.is_verified:

            plans = Trip.objects.filter(user=user.id)
            serializer = TripSerializer(plans, many=True)
            return Response(serializer.data)
        elif user.is_verified == False:
            raise AuthenticationFailed("User not Validated. Please Check Your Mail!")
        else:
            raise AuthenticationFailed("User not authenticated!")


class AllTripViews(APIView):
    authentication_classes = [BasicAuthHeaderAuthentication]

    def get(self, request):
        if request.query_params:
            return Response({"error": "Query parameters not allowed"})

        user = request.user

        if user.is_authenticated and user.is_verified:

            plans = Trip.objects.all()
            serializer = TripSerializer(plans, many=True)
            return Response(serializer.data)
        elif user.is_verified == False:
            raise AuthenticationFailed("User not Validated. Please Check Your Mail!")
        else:
            raise AuthenticationFailed("User not authenticated!")
