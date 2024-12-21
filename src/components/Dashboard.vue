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
                    href= "http://127.0.0.1:8080/"
                    target="_blank"
                    class="mt-2"
                    type="submit"
                    color="indigo"
                    block
                >
                    Перейти до панелі адміністратора
                </v-btn>
                <br>
                <p>Ви маєте можливість переглядати звіти:</p>
                <v-btn
                    @click="sendAttendanceReport"
                    class="mt-2"
                    type="submit"
                    color="indigo"
                    block
                >
                    Звіт "Статистика відвідуваності подій"
                </v-btn>
                <br>
                <v-btn
                    @click="downloadPopularityReport"
                    class="mt-2"
                    type="submit"
                    color="indigo"
                    block
                >
                    Звіт "Статистика популярності подій"
                </v-btn>
            </v-sheet>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import apiClient from '../api';
import { auth } from '../auth';

export default {
    name: 'Dashboard',
    setup() {
        const user = ref(null);
        const isAdmin = ref(false);

        const getUser = async () => {
            try {
                const response = await apiClient.get('/user');
                user.value = response.data;

                if (user.value && user.value.role) {
                    isAdmin.value = (user.value.role === 'admin');
                } else {
                    console.error('Роль користувача не визначена.');
                }
            } catch (error) {
                console.error('Помилка завантаження даних:', error);
            }
        };

        const updateStatus = () => {
            if (!auth.getStatus()) {
                user.value = null; // Очистимо дані користувача, якщо він не авторизований
                console.warn('Користувач вийшов із системи');
            } else {
                getUser(); // Заново завантажуємо дані користувача, якщо авторизований
            }
        };

        onMounted(() => {
            if (auth.getStatus()) {
                getUser();
            } else {
                console.warn('Користувач не авторизований');
            }

            // Слухаємо подію `storage` для оновлення стану
            window.addEventListener('storage', updateStatus);
        });

        onBeforeUnmount(() => {
            // Відписуємося від події `storage`
            window.removeEventListener('storage', updateStatus);
        });

        const sendAttendanceReport = async () => {
            if (user.value) {
                try {
            const response = await apiClient.post(`/emails/attendance-report/${user.value.id}`);
                    if (response.data.success) {
                        alert(`Звіт успішно надіслано на вашу електронну пошту ${user.value.email}`);
                    } else {
                        alert('Не вдалося надіслати звіт.');

                    }
                } catch (error) {
                    console.error('Помилка при надсиланні:', error);
                }
            }
        };

        //Логіка генерації та завантаження звіту із використанням черг у laravel-додатку
        const downloadPopularityReport = async () => {
            if (user.value) {
                try {
                    // Відправляємо запит на генерацію звіту
                    const response1 = await apiClient.get('/popularity-report');

                    if (response1.data.success) {
                        // Повідомляємо користувача, що завдання було успішно відправлено в чергу
                        alert(response1.data.message);

                        // Отримуємо jobId для подальшого запиту на завантаження
                        const jobId = response1.data.job_id;

                        // Запит на перевірку, чи файл готовий для завантаження
                        const response2 = await apiClient.get(`/download-popularity-report/${jobId}`);

                        if (response2.data.success === false) {
                            // Якщо файл не знайдений або завдання ще не завершено, виводимо повідомлення
                            alert(response2.data.message);
                        } else {
                            // Якщо файл готовий, створюємо URL для завантаження
                            const downloadUrl = `${apiClient.defaults.baseURL}/download-popularity-report/${jobId}`;

                            // Перенаправляємо користувача на URL для завантаження файлу
                            window.location.href = downloadUrl;
                        }
                    } else {
                        // Якщо завдання не вдалося відправити в чергу, виводимо повідомлення
                        console.error('Завдання на генерацію звіту не вдалося відправити');
                    }
                } catch (error) {
                    // Логування помилок, якщо запит не вдалося виконати
                    console.error('Помилка при запиті на генерацію звіту:', error);
                }
            }
        };
        
        //-----------------------------------------------------
        //Проста логіка (без черг) генерації та завантаження звіту
        //-----------------------------------------------------
        // const downloadPopularityReport = async () => {
        //     if (user.value) {
        //     }
        // };
        //-----------------------------------------------------
                
        return {
            user,
            isAdmin,
            sendAttendanceReport,
            downloadPopularityReport,
        };
    },
};
</script>