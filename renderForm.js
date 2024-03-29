import { user } from "./main.js"
import { renderLogin } from "./renderLogin.js";

export const renderForm = () => {
    const container = document.querySelector(".form")
    container.innerHTML = user
     ? `<div class="add-form">
    <input
        type="text"
        id="add-form-name"
        class="add-form-name"
        placeholder="Введите ваше имя"
    />
    <textarea
        id="add-form-text"
        type="textarea"
        class="add-form-text"
        placeholder="Введите ваш коментарий"
        rows="4"
    ></textarea>
    <div class="add-form-row">
     <button
      class="add-form-button"
      id="add-form-button"
     >
      Написать
     </button>
    </div>`
     : `<div>Чтобы оставить комментарий, <button class="entryButton" >авторизуйтесь</button></div>`;
     const entryButton = document.querySelector(".entryButton");
     if (entryButton) {
        entryButton.addEventListener("click", (event) => {
            event.preventDefault();
            renderLogin()
        })
     }
}