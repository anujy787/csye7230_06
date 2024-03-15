from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from .models import User
import bcrypt
from django.contrib.auth import authenticate
from rest_framework.authentication import BaseAuthentication
import base64
from django.utils import timezone

from .models import TravelPlan, Rating
from .serializers import TravelPlanSerializer, RatingSerializer

from django.core.mail import send_mail
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


# Create your views here.
class RegisterView(APIView):
    def post(self, request):
        if request.query_params:
            return Response({"error": "Query parameters not allowed"}, status=405)
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
            for field in data.keys():
                if field not in allowed_fields:
                    return Response({"error": "Bad Request"}, status=400)

            # Update user details
            if "first_name" in data:
                user.first_name = data["first_name"]
            if "last_name" in data:
                user.last_name = data["last_name"]
            if "password" in data:
                user.password = bcrypt.hashpw(
                    data["password"].encode("utf-8"), bcrypt.gensalt()
                ).decode("utf-8")

            user.account_updated = timezone.now()
            user.save()
            return Response({"message": "User details updated successfully!"})
        else:
            raise AuthenticationFailed("User not authenticated!")

    def options(self, request, *args, **kwargs):
        return Response(status=405, headers={"Allow": "GET"})



class TravelPlanViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TravelPlanSerializer

    def get_queryset(self):
        return TravelPlan.objects.filter(participants=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class RatingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RatingSerializer

    def get_queryset(self):
        return Rating.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TravelPlanViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TravelPlanSerializer

    def get_queryset(self):
        user = self.request.user
        return TravelPlan.objects.filter(
            models.Q(participants=user) | models.Q(created_by=user)
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        travel_plan = self.get_object()
        if request.user not in travel_plan.participants.all() and request.user not in travel_plan.pending_list.all():
            travel_plan.pending_list.add(request.user)
            return Response({'message': 'You have been added to the pending list.'}, status=status.HTTP_200_OK)
        return Response({'message': 'You are already a participant or in the pending list.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        travel_plan = self.get_object()
        if travel_plan.created_by == request.user:
            pending_users = travel_plan.pending_list.all()
            for user in pending_users:
                travel_plan.participants.add(user)
                travel_plan.pending_list.remove(user)
                send_email_notification(user, travel_plan)
            return Response({'message': 'Users have been approved and added to participants.'}, status=status.HTTP_200_OK)
        return Response({'message': 'Only the creator can approve users.'}, status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        travel_plan = self.get_object()
        if travel_plan.created_by == request.user:
            serializer = self.get_serializer(travel_plan, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        return Response({'message': 'Only the creator can update the travel plan.'}, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, *args, **kwargs):
        travel_plan = self.get_object()
        if travel_plan.created_by == request.user:
            travel_plan.delete()
            return Response({'message': 'Travel plan deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'message': 'Only the creator can delete the travel plan.'}, status=status.HTTP_403_FORBIDDEN)

def send_email_notification(user, travel_plan):
    subject = f'You have been added to the travel plan "{travel_plan.name}"'
    message = f'Congratulations! You have been added as a participant to the travel plan "{travel_plan.name}".'
    from_email = 'noreply@travelapp.com'
    send_mail(subject, message, from_email, [user.email], fail_silently=False)
