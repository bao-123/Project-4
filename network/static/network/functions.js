//contants
const getPostsURL = "/posts";
const likePostURL = "/like";
const commentURL = "/comment";
export const postURL = "/post";
export const getUserURL = "/user";
export const messageDivId = "messageDiv";


export const heartLikedIcon = '<i class="fa-solid fa-heart-circle-check fa-lg"></i>';
export const heartUnlikedIcon = '<i class="fa-solid fa-heart-circle-plus fa-lg"></i>';
export const heartAnimation = '<i class="fa-solid fa-heart-circle-plus fa-beat-fade fa-lg"></i>';
export const heartLikedClass = "fa-heart-circle-check";
export const heartUnlikedClass = "fa-heart-circle-plus";
export const heartAnimationClass = "fa-beat-fade";


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

export function displayMessage(message, type, divID, size="lg")
{
    const messageDiv = document.createElement("div");

    messageDiv.textContent = message;
    messageDiv.classList.add("message");
    messageDiv.classList.add(size);
    messageDiv.classList.add(type); // type is going to be 'danger', 'warning', 'success',...etc

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

export async function like(postId, action)
{
    try
    {
        const response = await fetch(likePostURL, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify({
                post_id: postId,
                action: action
            })
        });

        return {status: response.status, message: (await response.json()).message}
    } 
    catch(error)
    {
        console.error(error);
    }   
}


export async function getLikes(postId)
{
    try 
    {
        const response = await fetch(`${likePostURL}?post_id=${postId}`);
        if(response.status !== 200)
        {
            throw new Error("Failed to get likes");
        }
        return (await response.json()).likes;

    } catch (error) 
    {
        console.error(error);   
    }
}

export async function comment(postId, content) 
{
    try 
    {
        const response = await fetch(commentURL, {
            method: 'POST',
            headers: {
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify({
                post_id: postId,
                content: content
            })
        });
        if(response.status !== 200)
        {
            throw new Error("Failed to post comment");
        }
        const message = (await response.json()).message;

        return {status: response.status, message: message};
        
    } catch (error) 
    {
        console.error(error);    
    }
}