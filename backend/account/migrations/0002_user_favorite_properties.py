# Generated by Django 5.1.7 on 2025-04-09 08:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0001_initial'),
        ('property', '0008_propertyimage_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='favorite_properties',
            field=models.ManyToManyField(blank=True, related_name='favorited_by', to='property.property'),
        ),
    ]
