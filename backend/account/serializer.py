from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import ValidationError
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'is_staff', 'last_login', 'is_active', 
                  'date_joined', 'first_name', 'last_name']
        
class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            name=validated_data['name']
        )
        return user

class LogoutSerializer(serializers.Serializer):
    pass

class UpdateUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'password', 'first_name', 'last_name', 'phone_number']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': False},
            'phone_number': {'required': False}
        }
    
    def update(self, instance, validated_data):
        # instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.name = validated_data.get('name', instance.name)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        
        password = validated_data.get('password')
        if password:
            instance.set_password(password)
        instance.save()
        return instance