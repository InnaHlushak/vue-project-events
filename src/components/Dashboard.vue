<template>
    <div  class="container" >
        <h2 v-if="user">Вітаємо, {{ user.name }}!</h2>
        <p v-if="user">Ви маєте можливість  "Купити квиток" (за обраною вартістю) або "Отримати запрошення" (якщо вартість Безкоштовно) для довільної події, яку бажаєте "Відвідати"</p>
    </div>
</template>

<script>
import apiClient from '../api';
import { auth } from '../auth'; 

export default {
    name: 'Dashboard',
    data() {
        return {
            user: null,
        };
    },
    async mounted() {
        if (auth.getStatus()) {
            await this.getUser();
        } else {
            console.warn('Користувач не авторизований');
        }

        // Слухаємо подію `storage` для оновлення стану
        window.addEventListener('storage', this.updateStatus);
    },
    beforeUnmount() {
        // Відписуємося від події `storage`
        window.removeEventListener('storage', this.updateStatus);
    },
    methods: {
        async getUser() {
            try {
                const response = await apiClient.get('/user');
                this.user = response.data;
            } catch (error) {
                console.error('Помилка завантаження даних:', error);
            }
        },
        updateStatus() {
            // Перевіряємо статус авторизації
            if (!auth.getStatus()) {
                this.user = null; // Очистимо дані користувача, якщо він не авторизований
                console.warn('Користувач вийшов із системи');
            } else {
                this.getUser(); // Заново завантажуємо дані користувача, якщо авторизований
            }
        },
    },
};
</script>
