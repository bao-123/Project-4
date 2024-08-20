const postURL = "/post"
const getPostsURL = "/posts"

export async function post(content)
{
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
        console.log(response);
        if(response.status !== 200)
        {
            console.error("Error while fetching data.");
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
    console.log(parts);
    return parts.length == 2 ? parts.pop().split(";").shift() : '';
}