from rest_framework import serializers
from .models import User
import bcrypt
from .models import TravelPlan, Rating


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "password",
            "account_created",
            "account_updated",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
            instance.password = hashed_password.decode("utf-8")
        instance.save()
        return instance


class TravelPlanSerializer(serializers.ModelSerializer):
    average_rating = serializers.ReadOnlyField(source='average_rating')

    class Meta:
        model = TravelPlan
        fields = ['id', 'date', 'name', 'group_size', 'source', 'destination', 'preference', 'status', 'map_link', 'participants', 'created_by', 'updated_at', 'pending_list', 'unique_link', 'average_rating']
        read_only_fields = ['created_by', 'updated_at', 'unique_link', 'average_rating']

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'travel_plan', 'user', 'rating']
        read_only_fields = ['user']
