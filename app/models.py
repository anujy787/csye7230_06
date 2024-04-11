from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import uuid
from django.utils import timezone
import secrets


class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, first_name, last_name, password, **extra_fields)
    


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    account_created = models.DateTimeField(auto_now_add=True)
    account_updated = models.DateTimeField(auto_now=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    is_subscribed = models.BooleanField(default=False)
    bio = models.CharField(max_length=150, blank=True, default="")
    is_verified = models.BooleanField(default=False)
    username = None

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    class Meta:
        db_table = "users_data"


class VerificationToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def generate_token():
        return secrets.token_urlsafe(32)

    @staticmethod
    def create_token(user):
        token = VerificationToken.generate_token()
        VerificationToken.objects.create(user=user, token=token)
        return token

    @staticmethod
    def verify_user(token):
        try:
            verification_token = VerificationToken.objects.get(token=token)
            if (
                verification_token.created_at + timezone.timedelta(days=1)
                >= timezone.now()
            ):
                user = verification_token.user
                user.is_verified = True
                user.save()
                verification_token.delete()
                return True
            else:
                verification_token.delete()
                return False
        except VerificationToken.DoesNotExist:
            return False


class TravelPlan(models.Model):
    plan_id = models.AutoField(primary_key=True)
    created_by = models.UUIDField(blank=True)
    planned_date = models.DateField(null=False)
    name = models.CharField(max_length=120, null=False)
    source = models.CharField(max_length=255, blank=True)
    destination = models.CharField(max_length=255, blank=True)
    preference = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=50,
        default="new",
        choices=(("planning", "Planning"), ("completed", "Completed"), ("new", "New")),
    )
    link_to_map = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "travel_plans"

    def __str__(self):
        return self.name


class Trip(models.Model):
    plan = models.ForeignKey(
        "TravelPlan", on_delete=models.CASCADE, related_name="trips"
    )
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="user_trips"
    )
    status = models.CharField(
        max_length=50,
        choices=(
            ("Approved", "Approved"),
            ("Not Approved", "Not Approved"),
            ("Requested", "Requested"),
        ),
        default="Requested",
    )

    class Meta:
        db_table = "trips"

    def __str__(self):
        return f"{self.plan.name} - {self.status}"
