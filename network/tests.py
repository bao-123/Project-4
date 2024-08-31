from django.test import TestCase, Client
from network.models import *
from django.urls import reverse
from django.contrib.auth.models import AnonymousUser
from django.http import HttpResponseRedirect, JsonResponse
import json


# Create your tests here.

#fix
class TestCases(TestCase):

    @classmethod
    def setUp(self):

        self.client = Client()
        #create some users.
        user1 = User.objects.create_user("user1", "abc123@test.com", "test1")
        user2 = User.objects.create_user("user2", "abc1234@test.com", "test2")

        #create some posts
        Post.objects.create(user=user1, content="Post1")
        Post.objects.create(user=user2, content="Post2")
        Post.objects.create(user=user2, content="Post3")

    def test_index_view(self):
        self.client.login(username="user1", password="test1")

        response = self.client.get(reverse("index"))

        try:
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context["posts"].count(), 3)
        except Exception as e:
            print("Test index failed. ❌")
            print(e)
            return
        finally:
            self.client.logout()

        print("Test index finished. ✅")

    def test_post(self):
        #login a user.
        self.client.login(username="user1", password="test1")

        response = self.client.post(reverse("post"), {"content": "post4"}, content_type="application/json")
        index_response = self.client.get(reverse("index"))

        try:
            self.assertEqual(response.status_code, 200)
            self.assertEqual(index_response.status_code, 200)
            self.assertEqual(index_response.context["posts"].count(), 4)
        except Exception as e:
            print("Test post failed. ❌")
            print("Exception: ")
            print(e.__str__())
            return
        
        self.client.get(reverse("index")) #return to index page.
        self.client.logout()
        print("Test post finished. ✅")


    def test_login(self):
        #get user1
        user1 = User.objects.get(username="user1")

        view_response = self.client.get(reverse("login"))
        post_response = self.client.post(reverse("login"), {"username": "user1", "password": "test1"})

        try:
            self.assertEqual(view_response.status_code, 200)
            #user will be redirected to the index page when login successfully so 302 is what we excepted
            self.assertEqual(post_response.status_code, 302)
            self.assertEqual(post_response.wsgi_request.user, user1)
        except Exception as e:
            print("Test login failed. ❌")
            print(e.__str__())
            return
        
        self.client.get(reverse("index")) # returns to index page

        print("test login finished. ✅")
    
    def test_logout(self):
        self.client.login(username="user1")
        response = self.client.get(reverse("logout"))

        try:
            self.assertIs(response.__class__, HttpResponseRedirect) # check if logout function redirect user to the index view.
            self.assertTrue(response.wsgi_request.user.__class__ is AnonymousUser)

        except Exception as e:
            print("Test logout failed. ❌")
            print(e.__str__)
            return
        
        print("Logout test finished. ✅")
    
    def test_get_posts(self):

        response = self.client.get(reverse("get_posts_data"))
        data = response.json()
        try:
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data["posts"]), 3)
        except Exception as e:
            print("Test get posts failed. ❌")
            print(e.__str__())
            return
        
        print("Test get posts finished. ✅")
    
    def test_get_user(self):
        #get user1
        user1 = User.objects.get(username="user1")

        #login into user1
        self.client.force_login(user=user1)

        response = self.client.get(reverse("get_user"), {
            "username" : "" #username is '' because self.client is log in to user1, otherwise we'll need to provide user1's username.
        })

        try:
            self.assertIs(response.__class__, JsonResponse)
            data = response.json()
            user_info = data["user"]
            #because we have login our client to user1 so we except user1's data
            self.assertEqual(user_info["username"], user1.username)
            self.assertEqual(user_info["email"], user1.email)
            self.assertEqual(user_info["id"], user1.id)

        except Exception as e:
            print("Test get user failed ❌")
            print(e.__str__())
            return
        finally:
            self.client.logout()
    
        print("Test get user data finished. ✅")
    
    def test_follow(self):
        user1 = User.objects.get(username="user1")
        user2 = User.objects.get(username="user2")

        self.client.force_login(user=user1)

        request_body = json.encoder.JSONEncoder().encode({"id": user2.id, "action": "follow"})

        response = self.client.put(reverse("get_user"), request_body)

        user2 = User.objects.get(username="user2")
        try:
            self.assertEqual(response.status_code, 200)
            self.assertEqual(user2.followers.count(), 1)
            self.assertTrue(user2.followers.contains(user1))
            response = self.client.get(reverse("view_user", args=(user2.id,)))
            self.assertEqual(response.context["USER"]["followers_count"], 1)

        except Exception as e:
            print("Test follow failed. ❌")
            print(e.__str__())
            return
        finally:
            self.client.logout()
        print("Test follow finished. ✅")
    
    def test_unfollow(self):
        user1 = User.objects.get(username="user1")
        user2 = User.objects.get(username="user2")

        self.client.force_login(user=user1)
        user1.following.add(user2) #follow user2
        before_unfollow = user2.followers.count()

        request_body = json.encoder.JSONEncoder().encode({"id": user2.id, "action": "unfollow"})

        response = self.client.put(reverse("get_user"), request_body)
        user2 = User.objects.get(username="user2")

        try:
            self.assertEqual(response.status_code, 200)
            self.assertEqual(user2.followers.count(), before_unfollow-1) #ensure that after unfollow user2's followers is descrease by 1.
            self.assertFalse(user2.followers.contains(user1))
        except Exception as e:
            print("Test unfollow failed. ❌")
            print(e.__str__())
            return
        finally:
            self.client.logout()
        
        print("Test unfollow finished. ✅")
    
    def test_view_user(self):
        user1 = User.objects.get(username="user1")
        user2 = User.objects.get(username="user2")

        user1.following.add(user2)
        user2.following.add(user1)

        self.client.force_login(user=user1)

        response = self.client.get(reverse("view_user", args=(user1.id, )))

        page_content = response.context["USER"]
        try:
            self.assertEqual(response.status_code, 200)
            self.assertEqual(page_content["username"], user1.username)
            self.assertEqual(page_content["email"], user1.email)
            self.assertEqual(page_content["posts"].count(), user1.posts.count())
            self.assertFalse(page_content["is_follower"]) #user1 can't follow himself so it should be False
            self.assertEqual(page_content["following"], user1.following.count())
            self.assertEqual(page_content["followers_count"], user1.followers.count())

            #testing with user2
            response = self.client.get(reverse("view_user", args=(user2.id, )))
            page_content = response.context["USER"]

            self.assertEqual(response.status_code, 200)
            self.assertEqual(page_content["username"], user2.username)
            self.assertEqual(page_content["email"], user2.email)
            self.assertEqual(page_content["posts"].count(), user2.posts.count())
            self.assertTrue(page_content["is_follower"]) #this should be True because user1 is a follower of user2
            self.assertEqual(page_content["following"], user2.following.count())
            self.assertEqual(page_content["followers_count"], user2.followers.count())


        except Exception as e:
            print("Test view user failed. ❌")
            print(e)
            return
        finally:
            self.client.logout()

        print("Test view user finished. ✅")
