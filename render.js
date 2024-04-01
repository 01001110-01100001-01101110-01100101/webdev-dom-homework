import { postComment } from './api.js';
import { user, fetchPromiseGet } from './main.js';
import { format } from 'date-fns';

export const renderComments = ({
    comments,
    likeEventListener,
    replyEventListener,
}) => {
    const listElement = document.getElementById('list');
    const commentsHtml = comments
        .map((comment, index) => {
            const date = format(new Date(comment.date), 'dd.MM.yyyy hh:mm');
            return `<li class="comment" data-index=${index}>
                        <div class="comment-header">
                            <div>${comment.name}</div>
                            <div>${date}</div>
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
                                comment.isLiked ? '-active-like' : ''
                            }" data-index="${index}"></button>
                            </div>
                        </div>
                    </li>`;
        })
        .join('');
    listElement.innerHTML = commentsHtml;

    if (user) {
        const nameElement = document.getElementById('add-form-name');
        const textElement = document.getElementById('add-form-text');
        const buttonElement = document.getElementById('add-form-button');

        buttonElement.addEventListener('click', () => {
            nameElement.classList.remove('error');
            textElement.classList.remove('error');
            if (nameElement.value === '' || textElement.value === '') {
                nameElement.classList.add('error');
                textElement.classList.add('error');
                return;
            }

            buttonElement.disabled = true;
            buttonElement.textContent = 'Комментарий публикуется...';

            postComment({
                name: nameElement.value
                    .replaceAll('>', '&gt;')
                    .replaceAll('<', '&lt;'),
                text: textElement.value
                    .replaceAll('>', '&gt;')
                    .replaceAll('<', '&lt;'),
            })
                .then(() => {
                    fetchPromiseGet();
                })
                .then(() => {
                    textElement.value = '';
                    nameElement.value = '';
                    buttonElement.disabled = false;
                    buttonElement.textContent = 'Написать';
                })
                .catch((error) => {
                    if (error.message === 'Сервер сломался') {
                        alert('Сервер сломался попробуй позже.');
                        buttonElement.disabled = false;
                        buttonElement.textContent = 'Написать';
                        return;
                    }
                    if (error.message === 'Плохой запрос') {
                        alert(
                            'Ошибка в запросе, исправь данные и попробуй снова. Имя и текст должны содержать минимум 3 символа.',
                        );
                        buttonElement.disabled = false;
                        buttonElement.textContent = 'Написать';
                        return;
                    } else {
                        alert('Кажется пропал интернет.');
                    }
                });
        });
        replyEventListener();
    }
    likeEventListener();
};
