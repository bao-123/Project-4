const postURL = "/post"

export async function Post(content)
{
    try
    {
        const response = await fetch(postURL, {
            method: "POST",
            body: JSON.stringify({
                content: content
            })
        });
        if(response.status === 200)
        {
            return "success"
        }
        //create a function to display a message to user.
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