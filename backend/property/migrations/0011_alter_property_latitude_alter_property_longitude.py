# Generated by Django 5.2 on 2025-04-10 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0010_property_latitude_property_longitude'),
    ]

    operations = [
        migrations.AlterField(
            model_name='property',
            name='latitude',
            field=models.DecimalField(blank=True, decimal_places=14, max_digits=20, null=True),
        ),
        migrations.AlterField(
            model_name='property',
            name='longitude',
            field=models.DecimalField(blank=True, decimal_places=14, max_digits=20, null=True),
        ),
    ]
