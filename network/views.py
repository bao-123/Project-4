from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
import json
from django.contrib.auth.models import AnonymousUser

from .models import *

#TODO: create .github and some yaml files.

@login_required(login_url="login")
def index(request):

    posts = [post.to_dict(user=request.user) for post in Post.objects.order_by("-datetime").all()]

    
    return render(request, "network/index.html", {
        "posts": posts
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


#function to post a new post.
login_required(login_url="login")
def post(request):
    if request.method == "GET":
        post_id = request.GET["id"]
        requested_post = Post.objects.get(pk=post_id)

        if not requested_post:
            return HttpResponseNotFound(f"Not found any post with id is {request.GET['id']}")
        
        return JsonResponse({
            "post": requested_post.to_dict()
        }, status=200)
    
    elif request.method == "POST":
        post_content = json.loads(request.body).get("content")

        if not post_content:
            return JsonResponse({
                "message": "Can't create empty post."
            }, status=400) #we shouldn't let user create a empty post.
        
        Post.objects.create(user=request.user, content=post_content) #create new post.

        return JsonResponse({
            "message": "create post successfully."
        }, status=200)

    else:
        return HttpResponseNotAllowed("Method not allowed.")


# this function will provide all posts in database.
def get_posts(request):
    if request.method != 'GET':
        return HttpResponseNotAllowed("Method not allowed.")
    
    posts = Post.objects.order_by("-datetime").all()

    return JsonResponse({
        "posts": [post.to_dict(user=request.user) for post in posts]
    }, status=200)


def get_user(request):
    if request.method == "GET":
        username = request.GET["username"]
        if username == "":
                return JsonResponse({
                    "user": request.user.to_dict()
                }, status=200)
        else:
            requested_user = User.objects.get(username=username) #username is unique
            if not requested_user:
                return JsonResponse({
                    "message": "Error, doesn't found user with this id."
                }, status=404)
            
            return JsonResponse({
                "user": requested_user.to_dict()
            }, status=200)
        
    #TODO: fix
    elif request.method == "PUT":
        data = json.loads(request.body)

        user_id = data["id"]
        action = data["action"]

        user = User.objects.get(pk=user_id)
        if request.user == user:
            return JsonResponse({
                "message": "Can't follow or unfollow yourself!"
            }, status=400)
        try:
            if action == "follow":
                request.user.follow(user)
            elif action == "unfollow":
                request.user.unfollow(user)
            else:
                return HttpResponseNotFound("action not allowed")
        except Exception as e:
            print(e)
            return JsonResponse({
                "message": "Error, please try again."
            }, status=400)
        
        return JsonResponse({
            "message": f"{action} successfully."
        }, status=200)
    else:
        return HttpResponseNotAllowed("Method not allowed.")
    

@login_required(login_url="login")
def view_user(request, user_id: int):
    if request.method != "GET":
        return HttpResponseNotAllowed("method not allowed")
    
    user = User.objects.get(pk=user_id)
    user_posts = Post.objects.filter(user=user).order_by("-datetime").all()

    return render(request, "network/user.html", {
        "USER": {
            "username": user.username,
            "followers_count": user.followers.count(),
            "is_follower": user.followers.contains(request.user),
            "following": user.following.count(),
            "email": user.email,
            "posts": user_posts
        }
    })

@login_required(login_url="login")
def view_following(request):
    if request.method != "GET":
        return HttpResponseNotAllowed("method not allowed.")
    

    following_users = list(map(lambda x: x.to_dict(), list(request.user.following.all())))

    return render(request, "network/following.html", {
        "following_users": following_users
    })


@login_required(login_url="login")
def comment(request):
    if request.method == "POST":
        data = json.loads(request.body)

        post_id: int = data["post_id"]
        content: str = data["content"]

        if not content:
            return JsonResponse({
                "message": "Can't comment nothing!"
            }, status=400)

        try:
            post = Post.objects.get(pk=post_id)

            Comment.objects.create(user=request.user, post=post, content=content)

            return JsonResponse({
                "message": "Comment successfully"
            }, status=200)
        except Exception as e:
            print(e)
            return JsonResponse({
                "message": "Error"
            }, status=400)
    elif request.method == "GET":
        comments = [comment.to_dict() for comment in Comment.objects.all()]

        return JsonResponse(comments, status=200)
    else:
        return HttpResponseNotAllowed("method not allowed")
        
@login_required(login_url="login")
def like(request):
    if request.method == "POST":
        data = json.loads(request.body)
        post_id = data["post_id"]
        action = data["action"]

        try:
            POST = Post.objects.get(pk=post_id)

            if action == "like":
                POST.like(request.user)
            elif action == "unlike":
                POST.unlike(request.user)
            else:
                return JsonResponse({
                    "message": "Unknow action."
                }, status=400)

            return JsonResponse({
                "message": "like successfully"
            }, status=200)
        
        except Exception as e:
            print(e)
            return JsonResponse({
                "message": f"Failed to {action}."
            }, status=400)
    elif request.method == "GET":
        post_id = request.GET["post_id"]
        try:
            post = Post.objects.get(pk=post_id)

            return JsonResponse({
                "likes": post.get_likes()
            }, status=200)
        except Exception as e:
            print(e)
            return JsonResponse({"Can't found any post with this id"}, status=404)
        
    else:
        return HttpResponseNotAllowed("method not allowed")
    
