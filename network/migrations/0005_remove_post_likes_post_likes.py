# Generated by Django 5.1 on 2024-09-01 13:02

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_rename_followed_user_user_following'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='likes',
        ),
        migrations.AddField(
            model_name='post',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='posts_liked', to=settings.AUTH_USER_MODEL),
        ),
    ]
