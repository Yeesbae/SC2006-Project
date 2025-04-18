from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

sg_phone_validator = RegexValidator(
    regex=r'^(\+65)?[689]\d{7}$',
    message="Enter a valid Singapore phone number (e.g., 91234567 or +6591234567)."
)

class User(AbstractUser):
    name = models.CharField(max_length=50, blank=False, null=False)
    phone_number = models.CharField(
        max_length=12,  # +65 + 8 digits = 11 max, extra room for safety
        validators=[sg_phone_validator],
        blank=True,
        null=True,
    )
    favorite_properties = models.ManyToManyField(
        'property.Property',
        related_name='favorited_by',
        blank=True,
    )

    # Add related_name to avoid clashes
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='related_groups',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='related_permissions',
        blank=True,
    )