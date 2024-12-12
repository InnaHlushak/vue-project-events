//методи, які керують станом авторизації
// export const auth = {
//     isLogged: () => !!localStorage.getItem('authToken'),
//     logIn: (token) => {
//         localStorage.setItem('authToken', token);
//     },
//     logOut: () => {
//         localStorage.removeItem('authToken');
//     },
//     updateToken: (newToken) => {
//         localStorage.setItem('authToken', newToken);
//     },
// };


// модуль для керування станом авторизації в додатку з використанням токена
// auth.js

//локальна змінна, яка зберігає поточний токен авторизації, отриманий із localStorage
let authToken = localStorage.getItem('authToken'); 

const auth = {
    //м-д викливається при вході користувача: 
    //зpберігає токен у localStorage 
    // відправляє подію storage, щоб повідомити інші частини програми про зміну стану авторизації
    logIn(token) {
        localStorage.setItem('authToken', token);
        authToken = token;
        window.dispatchEvent(new Event('storage'));
    },

    //м-д викливається при виході користувача:
    //видаляє токен із localStorage
    //відправляє подію storage для синхронізації стану авторизації 
    logOut() {
        localStorage.removeItem('authToken');
        authToken = null;
        window.dispatchEvent(new Event('storage'));
    },

    //метод повертає поточний статус авторизації, перевіряючи наявність токена в localStorage
    getStatus() {
        return !!authToken;
    },

    //метод використовується для оновлення токена авторизації
    //зберігає новий токен у localStorage 
    //відправляє подію storage для синхронізації стану авторизації 
    updateToken(newToken) {
        localStorage.setItem('authToken', newToken);
        authToken = newToken;
        window.dispatchEvent(new Event('storage'));
    },
};

// Оновлюємо значення статусу:
//додається глобальний слухач  події storage
//який оновлює статус авторизації при зміні токена у localStorage
//забезпечуючи цим синхронізацію  компонент:синхронізувати стан між різними вкладками браузера
window.addEventListener('storage', () => {
    auth.isLogged = !!localStorage.getItem('authToken');
});

export { auth };