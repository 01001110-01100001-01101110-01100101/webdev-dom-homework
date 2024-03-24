import { getComments, postComment } from "./api.js";
import { getCommentDate } from "./date.js";
import { renderComments } from "./render.js";

const listElement = document.getElementById("list");
const nameElement = document.getElementById("add-form-name");
const textElement = document.getElementById("add-form-text");
const buttonElement = document.getElementById("add-form-button");

let comments = [];

const fetchPromiseGet = () => {
    getComments()
    .then((responseData) => {
        const appComments = responseData.comments.map((comment) => {
        return {
            name: comment.author.name,
            date: getCommentDate(comment.date),
            text: comment.text,
            likesQuantity: comment.likes,
            isLiked: false,
        };
        });
        console.log(responseData);
        comments = appComments;
        renderComments({ comments, likeEventListener, replyEventListener });
    });
};

listElement.innerHTML = "<li>Комментарии загружаются...</li>";
fetchPromiseGet();

const likeEventListener = () => {
    const likeElements = document.querySelectorAll(".like-button");
    for (const likeElement of likeElements) {
        likeElement.addEventListener("click", (event) => {
            event.stopPropagation();
            const index = likeElement.dataset.index;
            if (comments[index].isLiked) {
                comments[index].isLiked = false;
                comments[index].likesQuantity -= 1;
            } else {
                comments[index].isLiked = true;
                comments[index].likesQuantity += 1;
            }
            renderComments({ comments, likeEventListener, replyEventListener });
        });
    }
};

const replyEventListener = () => {
    const commentElements = document.querySelectorAll(".comment");
    for (const commentElement of commentElements) {
        commentElement.addEventListener("click", () => {
            event.stopPropagation();
            const index = commentElement.dataset.index;
            textElement.value = `> ${comments[index].text}, ${comments[index].name}, `;
        });
    }
};

// рендер (html через js)


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
