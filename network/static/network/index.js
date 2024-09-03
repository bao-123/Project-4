 import {post, displayMessage, getPosts, getUser,
         heartUnlikedIcon, heartAnimation, messageDivId,
        heartLikedIcon, like, heartLikedClass, heartAnimationClass,
        heartUnlikedClass,
        getLikes} from "./functions.js";

 //variables
 let postsDisplay;
 let user;

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".likeBtn").forEach(button => {
        button.addEventListener("mouseenter", likeBtnAnimation);
        button.addEventListener("mouseleave", likeBtnAnimation);
        button.onclick = () => {
            const action = button.firstElementChild.classList.contains(heartLikedClass) ? "unlike" : "like";
            const postId = Number(button.dataset.post_id);
            like(postId, action)
            .then(response => {
                if(response.status === 200)
                {
                    button.firstElementChild.classList.contains(heartAnimationClass) ? button.firstElementChild.classList.remove(heartAnimationClass) : null ;
                    button.firstElementChild.classList.toggle(heartLikedClass);
                    button.firstElementChild.classList.toggle(heartUnlikedClass);
                }
            })
            .then(() => { //we have to put in our function into a "then" method, otherwise. the our "getLikes" function will be executed before the like function so it won't display the latest data.
                getLikes(postId)
                .then(likes => {
                    button.nextElementSibling.textContent = likes;
                })
                .catch(error => console.error(error));
                }
        ).catch(error => console.error(error));
        };
    });

    postsDisplay = document.querySelector(".posts");
    getUser()
    .then(data => user = data.user)
    .catch(error => console.error(error));

    const postForm = document.querySelector("#postForm");

    postForm.addEventListener("submit", async function(event) {
        
        event.preventDefault(); // keep the page from reload.

        
        try
        {
        const content = document.querySelector("#userPostContent").value;
        //post
        const response = await post(content);
        if(response === "success")
        {
            displayMessage("Post successfully!", "success", messageDivId);
        }

        //loads posts from database.
        const newPosts = await getPosts();
        //clear posts
        postsDisplay.innerHTML = "";

        for(let post of newPosts)
        {
            const newPostDiv = document.createElement("div");
            const postContentDiv = document.createElement("div");
            const postButtonDiv = document.createElement("div");
            const likesInfo = document.createElement("div");

            newPostDiv.classList.add("post");
            postContentDiv.classList.add("postsContent");
            postButtonDiv.classList.add("postsBtn");
            likesInfo.classList.add("likesInfo");

            //finish
            const postUser = document.createElement("p");
            const postContentP = document.createElement("p");
            const datetimeP = document.createElement("p");
            const likeButton = document.createElement("button");
            const likesDisplay = document.createElement("p");
            const commentButton = document.createElement("button");

            //attributes
            postUser.classList.add("postUser");
            postUser.textContent = post.user.username;

            postContentP.classList.add("postContent");
            postContentP.textContent = post.content;

            datetimeP.classList.add("datetime");
            datetimeP.textContent = post.datetime;

            likeButton.classList.add("likeBtn");
            likesDisplay.classList.add("likesDisplay");
            likesDisplay.textContent = post.likes;
            if(post.is_liked)
            {
                likeButton.innerHTML = heartLikedIcon;
            }
            else
            {

                likeButton.innerHTML = heartUnlikedIcon;
                // run animation (font awesome) when user hover on the heart icon.
                likeButton.addEventListener("mouseenter", () => {
                    if(!likeButton.firstElementChild.classList.contains(heartLikedClass))
                    {
                        likeButton.firstChild.classList.add(heartAnimationClass);
                    }
                });
                likeButton.addEventListener("mouseleave", () => {
                    if(likeButton.firstElementChild.classList.contains(heartAnimationClass))
                    {
                        likeButton.firstElementChild.classList.remove(heartAnimationClass);
                    }
                });
            }
            
            likeButton.onclick = () => {

                const action = likeButton.firstElementChild.classList.contains(heartLikedClass) ? "unlike" : "like";
                like(post.id, action)
                .then(response => {
                    if(response.status === 200)
                    {
                        likeButton.innerHTML = action === "unlike" ? heartUnlikedIcon : heartLikedIcon;
                    }
                })
                .then(() => {
                    getLikes(post.id)
                    .then(likes => {
                        likeButton.nextElementSibling.textContent = likes;
                    })
                    .catch(error => console.error(error));
                    }
                ).catch(error => console.error(error));
            };
            
            commentButton.classList.add("commentBtn");
            commentButton.textContent = "Comment";

            postContentDiv.appendChild(postUser);
            if(post.user.id === user.id)
            {
                const editButton = document.createElement("button");

                editButton.classList.add("editBtn");
                editButton.textContent = "Edit";

                postContentDiv.appendChild(editButton);
            }
            postContentDiv.appendChild(postContentP);
            postContentDiv.appendChild(datetimeP);

            likesInfo.appendChild(likeButton);
            likesInfo.appendChild(likesDisplay);
            
            postButtonDiv.appendChild(likesInfo);
            postButtonDiv.appendChild(commentButton);

            newPostDiv.appendChild(postContentDiv);
            newPostDiv.appendChild(postButtonDiv);

            //append to DOM.
            postsDisplay.appendChild(newPostDiv);
        }
    }
    catch(error)
    {
        displayMessage("Error while fetching new data.", "danger", messageDivId);
        console.error(error);
    }
    }); 

});

function likeBtnAnimation(event){
    if(!event.target.firstElementChild.classList.contains(heartLikedClass))
    {
        if(event.type === "mouseleave")
        {
            event.target.firstElementChild.classList.remove(heartAnimationClass);
            return;
        }
        event.target.firstElementChild.classList.add(heartAnimationClass);
    }
}