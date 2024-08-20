 import {post, displayMessage, getPosts} from "./functions.js";

 //constants
 const postsDisplay = document.querySelector("#posts");

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
        //fetch new data from database.
        const newPosts = await getPosts();

        for(let post of new_posts)
        {
            const newPostDiv = document.createElement("div");
            const postContentDiv = document.createElement("div");
            const postButtonDiv = document.createElement("div");

            //finish
        }

    });

});

