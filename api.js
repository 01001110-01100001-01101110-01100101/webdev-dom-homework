export function getComments() {
    return fetch('https://wedev-api.sky.pro/api/v1/nane-akopyan/comments', {
        method: 'GET',
    }).then((response) => {
        return response.json();
    });
}

export function postComment({ name, date, text }) {
    return fetch('https://wedev-api.sky.pro/api/v1/nane-akopyan/comments', {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            date: date,
            text: text,
            likesQuantity: 0,
            isLiked: false,
        }),
    }).then((response) => {
        console.log(response);
        if (response.status === 400) {
            throw new Error('Плохой запрос');
        }
        if (response.status === 500) {
            throw new Error('Сервер сломался');
        } else {
            return response.json();
        }
    });
}

export function loginUser({ login, password }) {
    return fetch('https://wedev-api.sky.pro/api/user/login', {
        method: 'POST',
        body: JSON.stringify({
            login: login,
            password: password,
        }),
    }).then((response) => {
        console.log(response);
        if (response.status === 400) {
            throw new Error('Неправильный логин или пароль');
        } else {
            return response.json();
        }
    });
}
