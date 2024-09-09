import {comment, displayMessage, messageDivId, postURL, redirectTo} from "./functions.js"




document.addEventListener("DOMContentLoaded", () => {
    //comment buttons
    document.querySelectorAll(".commentBtn").forEach(button => {
        button.addEventListener("click", event =>  {
            const postId = Number(button.parentElement.parentElement.dataset.post_id); //get the post's id.
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
        });
    });
    //posts
    document.querySelectorAll(".post").forEach(post => {
        //get post's id.
        const postId = post.dataset.post_id; 
        post.addEventListener("click", event => {
            // .likeBtn,.fa-solid, .commentBtn, .editBtn
            const postFunctionalityButtons = Array.from(post.querySelectorAll(".likeBtn, .fa-solid, .commentBtn, .editBtn, .form-control, .btn-outline-primary"));

            if( !(postFunctionalityButtons.includes(event.target)) )
            {
                redirectTo(`${postURL}/${postId}`);
            }
        });
    });
});