import { getComments } from './api.js';
import { renderComments } from './render.js';
import { renderForm } from './renderForm.js';

export let token = null;
export let name = null;
export const setUser = (value1, value2) => {
    token = value1;
    name = value2;
};

export function renderApp() {
    const container = document.querySelector('.container');
    container.innerHTML = `<ul
    class="comments"
    id="list"
   >
        <li>Комментарии загружаются...</li>
   </ul>
        <div class="form">
   </div>`;
    fetchPromiseGet();
    renderForm();
}

let comments = [];

export const fetchPromiseGet = () => {
    getComments().then((responseData) => {
        const appComments = responseData.comments.map((comment) => {
            return {
                name: comment.author.name,
                date: comment.date,
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

renderApp();

export const likeEventListener = () => {
    const likeElements = document.querySelectorAll('.like-button');
    for (const likeElement of likeElements) {
        likeElement.addEventListener('click', (event) => {
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

export const replyEventListener = () => {
    const textElement = document.getElementById('add-form-text');
    const commentElements = document.querySelectorAll('.comment');
    for (const commentElement of commentElements) {
        commentElement.addEventListener('click', (event) => {
            event.stopPropagation();
            const index = commentElement.dataset.index;
            textElement.value = `> ${comments[index].text}, ${comments[index].name}, `;
        });
    }
};
