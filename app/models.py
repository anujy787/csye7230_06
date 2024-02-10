from django.db import models
from django.contrib.auth.models import AbstractUser
import bcrypt
from django.utils import timezone


# Create your models here.
class User(AbstractUser):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    account_created = models.DateTimeField(auto_now_add=True)
    account_updated = models.DateTimeField(auto_now_add=True)
    username = None

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "password"]

    class Meta:
        db_table = "users_model"
