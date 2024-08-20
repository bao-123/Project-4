 import {post, displayMessage} from "./function.js";


document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.querySelector("#postForm");

    postForm.addEventListener("submit", event => {
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

        
    });

});