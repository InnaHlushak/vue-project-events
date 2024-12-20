<template>
    <div class="container">
        <div v-if="user && !isAdmin">
            <v-sheet class="mx-auto pa-4 text-center" max-width="500" color="grey-lighten-4">
                <h2>Вітаємо, {{ user.name }}!</h2>
                <p>Ви маєте можливість "Купити квиток" (за обраною вартістю) або "Отримати запрошення" (якщо вартість Безкоштовно) для довільної події, яку бажаєте "Відвідати"</p>
                <router-link to="/">
                    <v-btn
                        class="mt-2"
                        type="submit"
                        color="indigo"
                        block                                                           
                    >
                        Обрати подію
                    </v-btn>
                </router-link>
            </v-sheet>
        </div>
        <div v-if="user && isAdmin">
            <v-sheet class="mx-auto pa-4 text-center" max-width="500" color="grey-lighten-4">
                <h2>Вітаємо, {{ user.name }}!</h2>                        
                <p>Ви маєте можливість створювати та редагувати події:</p>
                <v-btn
                    href="http://127.0.0.1:8080/"
                    target="_blank"
                    class="mt-2"
                    type="submit"
                    color="indigo"
                    block
                >
                    Перейти до панелі адміністратора
                </v-btn>
            </v-sheet>
        </div>
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
            isAdmin:false,
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

                if (this.user && this.user.role) {
                    this.isAdmin = (this.user.role === 'admin');
                } else {
                    console.error('Роль користувача не визначена.');
                }

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