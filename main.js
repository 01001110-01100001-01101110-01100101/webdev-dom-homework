"use strict";
const listElement = document.getElementById("list");
const nameElement = document.getElementById("add-form-name");
const textElement = document.getElementById("add-form-text");
const buttonElement = document.getElementById("add-form-button");

let comments = [];
// const isLoaidng = () => {

//   'Пожалуйста подождите, комментарии загружаются'
// }

const getCommentDate = (date) => {
    const currentDate = date ? new Date(date) : new Date();
    let dd = currentDate.getDate();
    if (dd < 10) dd = "0" + dd;
    let mm = currentDate.getMonth() + 1;
    if (mm < 10) mm = "0" + mm;
    let yy = currentDate.getFullYear() % 100;
    if (yy < 10) yy = "0" + yy;
    let hour = currentDate.getHours();
    if (hour < 10) hour = "0" + hour;
    let minute = currentDate.getMinutes();
    if (minute < 10) minute = "0" + minute;
    return dd + "." + mm + "." + yy + " " + hour + ":" + minute;
};

const fetchPromiseGet = () => {
    return fetch("https://wedev-api.sky.pro/api/v1/nane-akopyan/comments", {
        method: "GET",
    })
    .then((response) => {
        return response.json();
    })
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
        renderComments();
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
            renderComments();
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
const renderComments = () => {
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
                <span class="likes-counter">${comment.likesQuantity}</span>
                <button class="like-button ${
                comment.isLiked ? "-active-like" : ""
                }" data-index="${index}"></button>
                </div>
            </div>
            </li>`;
    })
    .join("");

    listElement.innerHTML = commentsHtml;
    likeEventListener();
    replyEventListener();
};

// клик на "написать отзыв"
buttonElement.addEventListener("click", () => {
    const date = getCommentDate();

    // "Ошибка" если нет имени или текста
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
        
        return fetch("https://wedev-api.sky.pro/api/v1/nane-akopyan/comments", {
            method: "POST",
            body: JSON.stringify({
                name: nameElement.value.replaceAll(">", "&gt;").replaceAll("<", "&lt;"),
                date: date,
                text: textElement.value.replaceAll(">", "&gt;").replaceAll("<", "&lt;"),
                likesQuantity: 0,
                isLiked: false,
            }),
        })
        .then((response) => {
            console.log(response);
            if (response.status === 400) {
                throw new Error("Плохой запрос");
            }
            if (response.status === 500) {
                throw new Error("Сервер сломался");
            } else {
                return response.json();
            }
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
