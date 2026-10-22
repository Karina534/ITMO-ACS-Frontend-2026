// Инициализация объекта api, через который будет происходить отправка запросов
const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000
});

// Перехватчик запросов для автоматического добавления токена авторизации ко всем запросам
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});