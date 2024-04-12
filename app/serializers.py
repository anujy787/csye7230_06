from rest_framework import serializers
from .models import User, TravelPlan
import bcrypt


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
            "rating",
            "is_subscribed",
            "bio",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "account_created": {"read_only": True},
            "account_updated": {"read_only": True},
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
    class Meta:
        model = TravelPlan
        fields = [
            "plan_id",
            "created_by",
            "planned_date",
            "name",
            "source",
            "destination",
            "preference",
            "status",
            "link_to_map",
        ]
        extra_kwargs = {
            "created_at": {"read_only": True},
        }

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop("created_by", None)
        return ret
