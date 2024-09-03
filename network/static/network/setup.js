
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".commentBtn").forEach(button => {
        button.onclick = () => {
            const postId = Number(button.parentElement.dataset.post_id);
            //TODO
            if(button.parentElement.querySelector(".commentForm"))
            {
                return;
            }

        }
    })
})