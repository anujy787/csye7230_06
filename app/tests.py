from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .views import RegisterView, LoginView, TravelPlanCreateView
import json
from faker import Faker
import base64
from app_logging import setup_logger
from .models import User, Trip, TravelPlan
from datetime import datetime
from django.contrib.auth import get_user_model

# Get a logger instance
logger = setup_logger()



class TravelPlanCreationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.fake = Faker()
        self.user_data = self.generate_random_user_data()
        self.user = self.create_test_user(self.user_data)
        self.client.force_authenticate(user=self.user)  # Use DRF's built-in auth handling

    def generate_random_user_data(self):
        return {
            "first_name": self.fake.first_name(),
            "last_name": self.fake.last_name(),
            "email": self.fake.email(),
            "password": self.fake.password(),
        }

    def create_test_user(self, user_data):
        # Assuming you have a registration function that can handle direct user creation
        user = User.objects.create_user(
            email=user_data['email'],
            password=user_data['password'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            is_verified=True  # Directly set verified if necessary for the test
        )
        return user

    def test_travel_plan_lifecycle(self):
        # User registration already handled in setUp
        plan_data = {
            "planned_date": "2024-01-01",
            "name": "Test Plan",
            "source": "BOS",
            "destination": "BOM",
            "status": "new"
        }

        # Create Travel Plan
        response = self.client.post(reverse("cloud:create-travel-plan"), data=plan_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Get Travel Plan
        response = self.client.get(reverse("cloud:get-travel-plan"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Update Travel Plan
        plan_id = response.data[0]['plan_id']
        updated_data = {"name": "Updated Travel Plan"}
        response = self.client.put(reverse("cloud:update-travel-plan", args=[plan_id]), data=updated_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)



    
        


        





class UserRegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_view = RegisterView()
        self.login_view = LoginView()
        self.fake = Faker()

    def generate_random_user_data(self):

        return {
            "first_name": self.fake.first_name(),
            "last_name": self.fake.last_name(),
            "email": self.fake.email(),
            "password": self.fake.password(),
        }

    def validate_fields(self, expected_data, actual_data, fields):
        logger.info("\n\nStart of Field Validations")
        for field in fields:
            logger.info(
                f"Validating {field} : {expected_data[field]} == {actual_data[field]}"
            )
            self.assertEqual(expected_data[field], actual_data[field])
        logger.info("\nPASSED!\nEnd of Validations\n\n")

    def test_user_registration(self):
        logger.info("#### START OF USER REGISTRATION TESTS ####")

        user_data = self.generate_random_user_data()

        logger.info(f"Generating Random User Data:\n{json.dumps(user_data, indent=2)}")

        response = self.client.post(
            reverse("cloud:reg"), data=user_data, format="json", view=self.register_view
        )

        logger.info(f"Registration Response Code: {response.status_code}")
        logger.info(
            f"Registration Response Data:\n{json.dumps(response.data, indent=2)}"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        fields_to_validate = ["first_name", "last_name", "email"]
        self.validate_fields(user_data, response.data, fields_to_validate)

        logger.info("#### END OF USER REGISTRATION TESTS ####")

    def test_user_update(self):

        logger.info("\n\n#### START OF USER UPDATION TESTS ####")

        user_data = self.generate_random_user_data()
        logger.info(f"Generating Random User Data:\n{json.dumps(user_data, indent=2)}")

        response = self.client.post(
            reverse("cloud:reg"), data=user_data, format="json", view=self.register_view
        )

        user = User.objects.filter(email=user_data["email"]).first()
        user.is_verified = True
        user.save()

        if response.status_code == 201:
            logger.info(
                f"New User Registration Successful!\n{json.dumps(response.data, indent=2)}"
            )
        else:
            logger.info(f"Unable to register: {response.data}")

        credentials = base64.b64encode(
            f"{user_data['email']}:{user_data['password']}".encode()
        ).decode("utf-8")

        headers = {
            "Authorization": f"Basic {credentials}",
        }

        updated_data = {
            "first_name": self.fake.first_name(),
            "last_name": self.fake.last_name(),
            "password": self.fake.password(),
        }
        logger.info(f"Updated Fields:\n{json.dumps(updated_data, indent=2)}")

        response = self.client.put(
            reverse("cloud:log"),
            headers=headers,
            data=updated_data,
            view=self.login_view,
        )

        logger.info(f"Update Response Code: {response.status_code}")
        logger.info(f"Update Response Data:\n{json.dumps(response.data, indent=2)}")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        logger.info(f"Check for Updated Fields")
        credentials = base64.b64encode(
            f"{user_data['email']}:{updated_data['password']}".encode()
        ).decode("utf-8")

        headers = {
            "Authorization": f"Basic {credentials}",
        }

        response = self.client.get(
            reverse("cloud:log"),
            headers=headers,
            view=self.login_view,
        )

        fields_to_validate = ["first_name", "last_name"]
        self.validate_fields(updated_data, response.data, fields_to_validate)

        if response.status_code == 200:
            logger.info(f"Get Response Data:\n{json.dumps(response.data, indent=2)}")

        logger.info("#### END OF USER UPDATION TESTS ####")


class TravelPlanModelTest(TestCase):
    def setUp(self):
        self.plan_data = {
            "created_by": "John Doe",
            "user_uuid": "123e4567-e89b-12d3-a456-426614174000",
            "planned_date": datetime.strptime("2024-05-01", "%Y-%m-%d"),  # Convert string to datetime
            "name": "Summer Vacation",
            "source": "New York",
            "destination": "Los Angeles",
            "preference": "None",
            "status": "new",
            "link_to_map": "https://maps.example.com",
        }

    def test_create_travel_plan(self):
        plan = TravelPlan.objects.create(**self.plan_data)
        self.assertIsNotNone(plan)
        self.assertEqual(plan.created_by, self.plan_data["created_by"])
        self.assertEqual(plan.user_uuid, self.plan_data["user_uuid"])
        self.assertEqual(plan.planned_date.strftime("%Y-%m-%d"), self.plan_data["planned_date"].strftime("%Y-%m-%d"))  # Convert planned_date to string
        self.assertEqual(plan.name, self.plan_data["name"])
        self.assertEqual(plan.source, self.plan_data["source"])
        self.assertEqual(plan.destination, self.plan_data["destination"])
        self.assertEqual(plan.preference, self.plan_data["preference"])
        self.assertEqual(plan.status, self.plan_data["status"])
        self.assertEqual(plan.link_to_map, self.plan_data["link_to_map"])

    def test_string_representation(self):
        plan = TravelPlan.objects.create(**self.plan_data)
        self.assertEqual(str(plan), self.plan_data["name"])


class TripModelTest(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create(
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='password'
        )
        self.plan = TravelPlan.objects.create(
            created_by='John Doe',
            user_uuid=self.user.id,
            planned_date='2024-05-01',
            name='Summer Vacation',
            source='New York',
            destination='Los Angeles',
            preference='None',
            status='new',
            link_to_map='https://maps.example.com'
        )

    def test_create_trip(self):
        trip = Trip.objects.create(plan=self.plan, user=self.user, status='Requested')
        self.assertIsNotNone(trip)
        self.assertEqual(trip.plan, self.plan)
        self.assertEqual(trip.user, self.user)
        self.assertEqual(trip.status, 'Requested')

    def test_string_representation(self):
        trip = Trip.objects.create(plan=self.plan, user=self.user, status='Requested')
        self.assertEqual(str(trip), f"{self.plan.name} - Requested")