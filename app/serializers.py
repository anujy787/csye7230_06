from rest_framework import serializers
from .models import User
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
