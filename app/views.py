from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from .models import User
import bcrypt
from django.contrib.auth import authenticate
from rest_framework.authentication import BaseAuthentication
import base64
import datetime


# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        if request.query_params:
            return Response({"error": "Query parameters not allowed"})
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
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

        return self.authenticate_credentials(request, username, password)

    def authenticate_credentials(self, request, username, password):

        user = User.objects.filter(email=username).first()
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

        if user.is_authenticated:
            serializer = UserSerializer(user)
            return Response(data=serializer.data)
        else:
            raise AuthenticationFailed("User not authenticated!")

    def put(self, request):
        user = request.user

        if user.is_authenticated:
            data = request.data

            allowed_fields = ["first_name", "last_name", "password"]
            for field in allowed_fields:
                if field in data and not data[field].strip():
                    return Response({"error": f"{field} cannot be blank"}, status=400)

            for field in data:
                if field not in allowed_fields:
                    return Response({"error": "Bad Request"}, status=400)

                if field == "first_name":
                    user.first_name = data["first_name"]
                elif field == "last_name":
                    user.last_name = data["last_name"]
                elif field == "password":
                    hashed_password = bcrypt.hashpw(
                        data["password"].encode("utf-8"), bcrypt.gensalt()
                    )
                    user.password = hashed_password.decode("utf-8")

            user.account_updated = datetime.datetime.now()
            user.save()
            return Response({"message": "User details updated successfully!"})
        else:
            raise AuthenticationFailed("User not authenticated!")

    def options(self, request, *args, **kwargs):
        return Response(status=405, headers={"Allow": "GET"})
