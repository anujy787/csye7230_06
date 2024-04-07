from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import uuid


class CustomUserManager(BaseUserManager):
    def create_user(
        self, email, username, first_name, last_name, password=None, **extra_fields
    ):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, email, first_name, last_name, password=None, **extra_fields
    ):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(email, first_name, last_name, password, **extra_fields)


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    account_created = models.DateTimeField(auto_now_add=True)
    account_updated = models.DateTimeField(auto_now=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    is_subscribed = models.BooleanField(default=False)
    bio = models.CharField(max_length=150, blank=True, default="")

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    class Meta:
        db_table = "users_data"
