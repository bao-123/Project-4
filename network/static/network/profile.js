import {getUser, displayMessage, getUserURL, messageDivId, getCSRFToken, redirectTo, postURL } from "./functions.js"
let user;
let username;
let pageCount = 1; //page count will be initialized at 0.

document.addEventListener("DOMContentLoaded", async function() {
    const csrfToken = getCSRFToken();
    const followBtn = document.querySelector("#followBtn");
    const followersDisplay = document.querySelector("#followers");

    username = document.querySelector(".user_info > h1").innerHTML; //username is unique

    // get information of the user that is show on the profile page.
    const data = await getUser(username);
    user = data.user;

    followBtn.addEventListener("click", async function() {
        if(followBtn.innerHTML !== "follow" && followBtn.innerHTML !== "unfollow")
        {
            return;
        }
        const response = await fetch(getUserURL, {
            headers: {
                "X-CSRFToken": csrfToken
            },
            method: "PUT",
            body: JSON.stringify({
                id: user.id,
                action: followBtn.innerHTML
            })
        });
        let message = await response.json();
        message = message.message;
        if(response.status != 200)
        {
            displayMessage(message, "danger", messageDivId);
            return;
        }

        displayMessage(message, "success", messageDivId);
        if(followBtn.innerHTML === "follow")
        {
            followBtn.innerHTML = "unfollow";
            followBtn.classList.remove("follow");
            followBtn.classList.add("unfollow");
        }
        else
        {
            followBtn.innerHTML = "follow";
            followBtn.classList.remove("unfollow");
            followBtn.classList.add("follow");
        }

        //get user'new followers count.
        const new_data = await getUser(username);
        followersDisplay.innerHTML = `Followers: ${new_data.user.followers}`;
    });

    document.querySelectorAll(".post").forEach(post => {
        const postId = post.dataset.post_id;
        post.addEventListener("click", () => {
            redirectTo(`${postURL}/${postId}`);
        });
    });
});