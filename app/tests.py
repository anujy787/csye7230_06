from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .views import RegisterView, LoginView
import json
from faker import Faker
import base64
from app_logging import setup_logger
from .models import User

# Get a logger instance
logger = setup_logger()


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
