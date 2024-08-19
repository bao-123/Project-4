from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator


class User(AbstractUser):
    pass

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    datetime = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(validators=[MinValueValidator(0)]) # minimun value of this field is 0..

