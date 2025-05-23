# Generated by Django 5.2 on 2025-04-13 10:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0015_alter_propertyrequest_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='propertyrequest',
            name='image',
        ),
        migrations.CreateModel(
            name='PropertyRequestImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='property_request_images/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='request_images', to='property.property')),
            ],
        ),
    ]
