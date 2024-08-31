//contants
const postURL = "/post";
const getPostsURL = "/posts";
export const getUserURL = "/user";
export const messageDivId = "messageDiv";

const heartLikedIcon = '<i class="fa-solid fa-heart-circle-check"></i>';
export const heartUnlikedIcon = '<i class="fa-solid fa-heart-circle-plus"></i>';
export const heartAnimation = '<i class="fa-solid fa-heart-circle-plus fa-beat-fade"></i>';


export async function post(content)
{
    if(content.trim() === "")
    {
        displayMessage("Can't post nothing!", "danger", messageDivId);
        return;
    }

    try
    {
        const csrfToken = getCSRFToken();
        const response = await fetch(postURL, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify({
                content: content
            })
        });
        if(response.status === 200)
        {
            return "success";
        }
        else
        {
            console.log("error");
        }
    }
    catch(error)
    {
        console.error(error);
    }
}

export function displayMessage(message, type, divID)
{
    const messageDiv = document.createElement("div");

    messageDiv.textContent = message;
    messageDiv.classList.add("message");
    messageDiv.classList.add(type) // type is going to be 'danger', 'warning', 'success',...etc

    messageDiv.addEventListener("animationend", event => {
        if(event.animationName == "appear") // if the message just appear
        {
            event.target.style.animation = "disappear 2s ease-in"; // disappear the message
        }
        else //if the animation disappear just end.
        {
            event.target.style.display = "none"; 
        }
    });

    document.querySelector(`#${divID}`).appendChild(messageDiv);

}

export async function getPosts()
{
    try
    {
        const response = await fetch(getPostsURL);
        if(response.status !== 200)
        {
            displayMessage("Error while fetching data.", "danger", messageDivId);
            return;
        }

        const data = await response.json();

        return data.posts;
    }
    catch(error)
    {
        console.error(error);
    }
}

//get csrf token so we can send some POST request.
export function getCSRFToken()
{
    const parts = document.cookie.split("csrftoken=");
    return parts.length == 2 ? parts.pop().split(";").shift() : '';
}

// function to get user's information.
export async function getUser(username='')
{
    try
    {
        const response = await fetch(`${getUserURL}?username=${username}`)
        if(response.status !== 200)
        {
            return "Error";
        }
        const data = await response.json();
        
        return data;
    }
    catch(error)
    {
        console.error(error);
    }
}

export async function like(postId, likeBtn)
{
    
}
