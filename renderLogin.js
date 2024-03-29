import { loginUser } from "./api.js";
import { renderApp, setUser, user } from "./main.js";

export const renderLogin = () => {
    const container = document.querySelector(".container");
    container.innerHTML = ` <div class="add-form">
        <input
            type="text"
            id="add-form-login"
            class="add-form-login"
            placeholder="Введите ваш логин"
        />
        <input
            id="add-form-password"
            type="password"
            class="add-form-password"
            placeholder="Введите ваш пароль"
        />
        <div class="add-form-row">
            <button
            class="add-form-button"
            id="add-form-button"
            >
            Войти
            </button>
        </div>`;
    const loginInputElement = document.querySelector(".add-form-login");
    const passwordInputElement = document.querySelector(".add-form-password");
    const loginButton = document.querySelector(".add-form-button");
    if (loginButton) {
        loginButton.addEventListener("click", (event) => {
            event.preventDefault();
            loginUser({
                login: loginInputElement.value,
                password: passwordInputElement.value,
            }).then((response) => {
                if (response.status === 400) {
                    throw new Error("Неправильный логин или пароль");
                } else {
                    setUser(response.user.token);
                    console.log(user);
                    renderApp();
                }
            }).catch((error) => {
                if (error.message === "Неправильный логин или пароль") {
                    alert("Неправильный логин или пароль.");
                }
            });
        });
    };
};
