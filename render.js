import { postComment } from "./api.js";
import { getCommentDate } from "./date.js";

export const renderComments = ({ comments, likeEventListener, replyEventListener }) => {
    const listElement = document.getElementById("list");
    const commentsHtml = comments
    .map((comment, index) => {
        return `<li class="comment" data-index=${index}>
                        <div class="comment-header">
                            <div>${comment.name}</div>
                            <div>${comment.date}</div>
                        </div>
                        <div class="comment-body">
                            <div class="comment-text">
                            ${comment.text}
                            </div>
                        </div>
                        <div class="comment-footer">
                            <div class="likes">
                            <span class="likes-counter">${
                            comment.likesQuantity
                            }</span>
                            <button class="like-button ${
                            comment.isLiked ? "-active-like" : ""
                            }" data-index="${index}"></button>
                            </div>
                        </div>
                    </li>`;
    })
    .join("");
    listElement.innerHTML = commentsHtml;

    const nameElement = document.getElementById("add-form-name");
    const textElement = document.getElementById("add-form-text");
    const buttonElement = document.getElementById("add-form-button");


    buttonElement.addEventListener("click", () => {
        const date = getCommentDate();

        nameElement.classList.remove("error");
        textElement.classList.remove("error");
        if (nameElement.value === "" || textElement.value === "") {
            nameElement.classList.add("error");
            textElement.classList.add("error");
            return;
        }
        const fetchPromisePost = () => {
            buttonElement.disabled = true;
            buttonElement.textContent = "Комментарий публикуется...";

            postComment({
                name: nameElement.value.replaceAll(">", "&gt;").replaceAll("<", "&lt;"),
                text: textElement.value.replaceAll(">", "&gt;").replaceAll("<", "&lt;"),
            })
            .then(() => {
                return fetchPromiseGet();
            })
            .then(() => {
                textElement.value = "";
                nameElement.value = "";
                buttonElement.disabled = false;
                buttonElement.textContent = "Написать";
            })
            .catch((error) => {
                if (error.message === "Сервер сломался") {
                    alert("Сервер сломался попробуй позже.");
                    buttonElement.disabled = false;
                    buttonElement.textContent = "Написать";
                    return;
                }
                if (error.message === "Плохой запрос") {
                    alert("Ошибка в запросе, исправь данные и попробуй снова. Имя и текст должны содержать минимум 3 символа.");
                    buttonElement.disabled = false;
                    buttonElement.textContent = "Написать";
                    return;
                } else {
                    alert("Кажется пропал интернет.");
                }
            });
        };
        fetchPromisePost();
    });
    likeEventListener();
    replyEventListener();
};


    

