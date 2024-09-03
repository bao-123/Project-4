from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator


class User(AbstractUser):
    
    following = models.ManyToManyField("User", blank=True, related_name="followers")
    
    def unfollow(self, user) -> None:
        if self.following.contains(user):
            self.following.remove(user)
            return
        raise Exception("Haven't follow")

    def follow(self, user) -> None:
        if not self.following.contains(user):
            self.following.add(user)
            return 
        raise Exception("Already follow")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "followers": self.followers.count(),
            "followings": self.following.count()
        }

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    datetime = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, blank=True, related_name="posts_liked") # minimun value of this field is 0..

    def __str__(self):
        return f"""
        User: {self.user.username}
        {self.content}
        {self.datetime}
        likes: {self.likes}"""
    
    def get_likes(self) -> int:
        return self.likes.count()
    
    def like(self, user: User) -> None:
        if not self.likes.contains(self):
            self.likes.add(user)
            return
        raise Exception("User Already like this post")
    
    def unlike(self, user: User) -> None:
        if self.likes.contains(user):
            self.likes.remove(user)
            return
        raise Exception("User doesn't like this post.")

    def to_dict(self, user=None):
        return {
            "id": self.id,
            "user": self.user.to_dict(),
            "content": self.content,
            "datetime": self.datetime.strftime("%d/%m/%Y, %H:%M:%S"),
            "likes": self.get_likes(),
            "is_liked": self.likes.contains(user) if user else False
        }


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_comments")
    content = models.TextField()
    likes = models.ManyToManyField(User, blank=True, related_name="comment_likes")

    def get_likes(self):
        return self.likes.count()
    
    def edit(self, new_content: str):
        self.content = new_content

    def to_dict(self):
        return {
            "user": self.user.to_dict(),
            "post": self.post.to_dict(),
            "content": self.content
        }
    