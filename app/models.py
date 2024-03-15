# models.py

import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
import bcrypt
from django.utils import timezone

from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.db.models import Avg
from django.core.validators import MinValueValidator, MaxValueValidator

class TravelPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField()
    name = models.CharField(max_length=255)
    group_size = models.PositiveIntegerField(default=1)
    source = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    preference = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=(
        ('new', 'New'),
        ('planning', 'Planning'),
        ('completed', 'Completed'),
    ), default='new')
    map_link = models.URLField(blank=True, null=True)
    participants = models.ManyToManyField(User, related_name='travel_plans')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_travel_plans')
    updated_at = models.DateTimeField(auto_now=True)
    pending_list = models.ManyToManyField(User, related_name='pending_travel_plans', blank=True)
    unique_link = models.URLField(unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.unique_link:
            self.unique_link = f"https://ventureverse.com/plan/{get_random_string(length=10)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def average_rating(self):
        ratings = self.ratings.all().values_list('rating', flat=True)
        if ratings:
            return sum(ratings) / len(ratings)
        return 0

class Rating(models.Model):
    travel_plan = models.ForeignKey(TravelPlan, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    def __str__(self):
        return f"{self.user.username} rated {self.travel_plan.name} {self.rating}"

    class Meta:
        unique_together = ['travel_plan', 'user']
        app_label = 'app'
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
