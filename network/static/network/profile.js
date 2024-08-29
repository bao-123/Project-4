import {getUser, displayMessage } from "./functions.js"
let user;
document.addEventListener("DOMContentLoaded", () => {
    const followBtn = document.querySelector(".user_info > button");
    username = document.querySelector("user_info > h1").value; //username is unique
    user = getUser(username);

    followBtn.addEventListener("click", async function() {
        if(followBtn.innerHTML === "Follow")
        {
            //follow user on profile page.
            try 
            {
                
            } catch (error) 
            {
                displayMessage("Error, please try again.", "danger", )
                console.error(error);
            }

        }
    })
});