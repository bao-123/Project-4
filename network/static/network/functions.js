//contants
const postURL = "/post";
const getPostsURL = "/posts";
const getUserURL = "/user";
const messageDivId = "messageDiv";

export async function post(content)
{
    if(content === "")
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
    messageDiv.classList.add(type) // type is going to be 'danger', 'warning', 'success',...etc

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
function getCSRFToken()
{
    const parts = document.cookie.split("csrftoken=");
    return parts.length == 2 ? parts.pop().split(";").shift() : '';
}

// function to get user's information.
export async function getUser()
{
    try
    {
        const response = await fetch(getUserURL);
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