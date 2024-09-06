import {comment, displayMessage, messageDivId, postURL} from "./functions.js"


document.addEventListener("DOMContentLoaded", () => {
    //comment buttons
    document.querySelectorAll(".commentBtn").forEach(button => {
        button.onclick = () => {
            const postId = Number(button.parentElement.dataset.post_id);
            //TODO
            if(button.parentElement.querySelector(".commentForm"))
            {
                return;
            }
            //create a form so user can write a comment and submit.

            const commentForm = document.createElement("form");
            const commentInput = document.createElement("input");
            const submitButton = document.createElement("button");

            commentForm.classList.add("commentForm");

            commentInput.classList.add("form-control");
            commentInput.placeholder = "Write your comment here."
            commentInput.type = "text";

            submitButton.classList.add("btn");
            submitButton.classList.add("btn-outline-primary");
            submitButton.classList.add("btn-sm");
            submitButton.textContent = "Submit";
            submitButton.type = "submit";

            commentForm.appendChild(commentInput);
            commentForm.appendChild(submitButton);

            commentForm.addEventListener("submit", async function(event) {
                event.preventDefault();
                if(!commentInput.value)
                {
                    displayMessage("Can't send empty message", "danger", messageDivId);
                    return;
                }
                try 
                {
                    const response = await comment(postId, commentInput.value);
                    if (response.status !== 200) 
                    {
                        displayMessage(response.message, "danger", messageDivId);
                        return;
                    }  
                    displayMessage(response.message, "success", messageDivId);
                    return;

                } catch (error) 
                {
                    displayMessage("Failed to post this comment", "danger", messageDivId);
                    console.error(error);
                }

            });

            button.parentElement.appendChild(commentForm);

        };
    });
    //posts
    document.querySelectorAll(".post").forEach(post => {
        post.addEventListener("click", () => {
            //get post's id
            //we have stored the post's id in the last element of the div
            const postId = post.lastElementChild.dataset.post_id;

            //redirect user to the view post page
            location.href = `${postURL}/${postId}`;
        });
    });
});