from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import uuid
from django.utils import timezone
import secrets


class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(
            email=email, first_name=first_name, last_name=last_name, **extra_fields
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
    first_name = models.CharField(max_length=25, help_text="User's first name")
    last_name = models.CharField(max_length=25, help_text="User's last name")
    email = models.EmailField(unique=True, help_text="User's email address")
    password = models.CharField(max_length=255)  # Avoid using help_text for passwords
    account_created = models.DateTimeField(
        auto_now_add=True, help_text="Timestamp when the user account was created"
    )
    account_updated = models.DateTimeField(
        auto_now=True, help_text="Timestamp when the user account was last updated"
    )
    rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=5.00, help_text="User's rating"
    )
    is_subscribed = models.BooleanField(
        default=False, help_text="Whether the user is subscribed to notifications"
    )
    bio = models.CharField(
        max_length=150, blank=True, default="", help_text="User's biography"
    )
    is_verified = models.BooleanField(
        default=False, help_text="Whether the user is verified"
    )
    username = None

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    class Meta:
        db_table = "users_data"


class VerificationToken(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        help_text="User associated with this verification token",
    )
    token = models.CharField(max_length=64, help_text="Verification token value")
    created_at = models.DateTimeField(
        auto_now_add=True, help_text="Timestamp when the token was created"
    )

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
    plan_id = models.AutoField(
        primary_key=True, help_text="Unique identifier for the travel plan"
    )
    created_by = models.CharField(
        max_length=50, help_text="User who created the travel plan"
    )
    user_uuid = models.UUIDField(
        help_text="UUID of the user associated with the travel plan"
    )
    planned_date = models.DateField(
        null=False, help_text="Date when the travel plan is scheduled"
    )
    name = models.CharField(
        max_length=120, null=False, help_text="Name of the travel plan"
    )
    source = models.CharField(
        max_length=255, blank=True, help_text="Starting location of the travel plan"
    )
    destination = models.CharField(
        max_length=255, blank=True, help_text="Destination of the travel plan"
    )
    preference = models.TextField(
        blank=True, null=True, help_text="Additional preferences for the travel plan"
    )
    status = models.CharField(
        max_length=50,
        default="new",
        choices=(("planning", "Planning"), ("completed", "Completed"), ("new", "New")),
        help_text="Status of the travel plan",
    )
    link_to_map = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="URL link to the map for the travel plan",
    )
    created_at = models.DateTimeField(
        auto_now_add=True, help_text="Timestamp when the travel plan was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True, help_text="Timestamp when the travel plan was last updated"
    )

    class Meta:
        db_table = "travel_plans"

    def __str__(self):
        return self.name


class Trip(models.Model):
    plan = models.ForeignKey(
        "TravelPlan",
        on_delete=models.CASCADE,
        related_name="trips",
        help_text="Travel plan associated with the trip",
    )
    user = models.ForeignKey(
        "User",
        on_delete=models.CASCADE,
        related_name="user_trips",
        help_text="User associated with the trip",
    )
    status = models.CharField(
        max_length=50,
        choices=(
            ("Approved", "Approved"),
            ("Not Approved", "Not Approved"),
            ("Requested", "Requested"),
        ),
        default="Requested",
        help_text="Status of the trip",
    )

    class Meta:
        db_table = "trips"
        unique_together = ("plan", "user")

    def __str__(self):
        return f"{self.plan.name} - {self.status}"
