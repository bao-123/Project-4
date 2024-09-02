 import {post, displayMessage, getPosts, getUser,
         heartUnlikedIcon, heartAnimation, messageDivId,
        heartLikedIcon, like} from "./functions.js";

 //variables
 let postsDisplay;
 let user;

document.addEventListener("DOMContentLoaded", () => {
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

            newPostDiv.classList.add("post");
            postContentDiv.classList.add("postsContent");
            postButtonDiv.classList.add("postsBtn");

            //finish
            const postUser = document.createElement("p");
            const postContentP = document.createElement("p");
            const datetimeP = document.createElement("p");
            const likeButton = document.createElement("button");
            const commentButton = document.createElement("button");

            //attributes
            postUser.classList.add("postUser");
            postUser.textContent = post.user.username;

            postContentP.classList.add("postContent");
            postContentP.textContent = post.content;

            datetimeP.classList.add("datetime");
            datetimeP.textContent = post.datetime;

            likeButton.classList.add("likeBtn");
            if(post.is_liked)
            {
                likeButton.innerHTML = heartLikedIcon;
            }
            else
            {

                likeButton.innerHTML = heartUnlikedIcon;
                // run animation (font awesome) when user hover on the heart icon.
                likeButton.addEventListener("mouseenter", () => {
                    if(likeButton.innerHTML != heartLikedIcon)
                    {
                        likeButton.innerHTML = heartAnimation;
                    }
                });
                likeButton.addEventListener("mouseleave", () => {
                    if(likeButton.innerHTML != heartLikedIcon)
                    {
                        likeButton.innerHTML = heartUnlikedIcon;
                    }
                });
            }
            
            likeButton.onclick = () => {
                const action = likeButton.innerHTML === heartLikedIcon ? "unlike" : "like";
                console.log(action);
                console.log(post.id);
                like(post.id, action)
                .then(response => {
                    if(response.status === 200)
                    {
                        likeButton.innerHTML = action === "unlike" ? heartUnlikedIcon : heartLikedIcon;
                    }
                })
                .catch(error => console.error(error));
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

            postButtonDiv.appendChild(likeButton);
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
