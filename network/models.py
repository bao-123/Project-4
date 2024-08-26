from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator


class User(AbstractUser):
    
    def to_dict(self) -> dict:
        return {
            "username": self.username,
            "email": self.email,
            "id": self.id
        }

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    datetime = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0, validators=[MinValueValidator(0)]) # minimun value of this field is 0..

    def __str__(self):
        return f"""
        User: {self.user.username}
        {self.content}
    {self.datetime}
    likes: {self.likes}"""

    def to_dict(self):
        return {
            "user": self.user.to_dict(),
            "content": self.content,
            "datetime": self.datetime.strftime("%d/%m/%Y, %H:%M:%S"),
            "likes": self.likes
        }


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comment")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_comment")
    content = models.TextField()
    likes = models.PositiveIntegerField(default=0)

    def to_dict(self):
        return {
            "user": self.user,
            "post": self.post,
            "content": self.content
        }
    