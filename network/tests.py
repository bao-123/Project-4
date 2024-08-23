from django.test import TestCase, Client
from network.models import *
from django.urls import reverse
from django.contrib.auth.models import AnonymousUser
from django.http import HttpResponseRedirect, JsonResponse


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
        
        response = self.client.get(reverse("index"))
        try:
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.context["posts"].count(), 3)
        except Exception as e:
            print("Test index failed. ❌")
            print(e)
            return

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

        response = self.client.get(reverse("get_user"))

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
        
        print("Test get user data finished. ✅")
        self.client.logout()

