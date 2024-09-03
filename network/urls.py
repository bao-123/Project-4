
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("post", views.post, name="post"),
    path("posts", views.get_posts, name="get_posts_data"),
    path("user", views.get_user, name="get_user"),
    path("user/<int:user_id>", views.view_user, name="view_user"),
    path("following", views.view_following, name="following"),
    path("like", views.like, name="like_post"),
    path("comment", views.comment, name="comment")
]
