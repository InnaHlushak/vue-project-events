import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8080/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Додає cookies до запитів (важливо для Sanctum або автентифікації)
});

// Додавання токена ( з локального сховища)
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken'); // Отримання токена з локального сховища
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;