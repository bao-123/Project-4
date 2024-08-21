 import {post, displayMessage, getPosts, getUser} from "./functions.js";

 //constants
 const postsDisplay = document.querySelector(".posts");
 const user = getUser();

document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.querySelector("#postForm");

    postForm.addEventListener("submit", async function() {
        event.preventDefault(); // keep the page from reload.

        const content = document.querySelector("#userPostContent").value;
        //post
        post(content)
        .then(response => {
            if(response === "success")
            {
                displayMessage("Post successfully!", "success", "messageDiv");
            }
        })
        .catch(error => console.error(error));
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
            likeButton.textContent = "🤍";

            commentButton.classList.add("commentBtn");
            commentButton.textContent = "Comment";

            postContentDiv.appendChild(postUser);
            if(post.user.id == user.id)
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
    });

});

