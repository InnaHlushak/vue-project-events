<template>
    <div v-if="user" class="container">
        <v-sheet class="mx-auto" max-width="700" color="grey-lighten-4">
            <v-row justify="center">
            <p>Вітаємо, {{ user.name }}!</p>
            <p>Запрошення  буде надіслано на Вашу поштову скриньку {{ user.email }}</p>
            </v-row>
        
        <v-row justify="center">
            <v-btn class="mt-2"  type="submit" color="indigo" @click="sendInvitation"> Надіслати запрошення </v-btn>
        </v-row>
    </v-sheet>
    </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api';
import { auth } from '../auth';

export default {
    name: 'EventInvitation',
    props: {
        id: {
            type: [String, Number],
            required: true,
        },
        number: {
            type: [String, Number],
            required: true,
        },
    },
    
    setup(props) {
        const router = useRouter();

        const idEvent = ref(props.id);
        const number = ref(props.number);

        const user = ref(null);

        const getUser = async () => {
            try {
                const response = await apiClient.get('/user');
                user.value = response.data;
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

        onMounted(async () => {
            if (auth.getStatus()) {
                await getUser();
            } else {
                console.warn('Користувач не авторизований');
            }

            window.addEventListener('storage', updateStatus);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('storage', updateStatus);
        });

        const sendInvitation = async () => {
            if (idEvent.value && user.value) {
                try {
            const response = await apiClient.post(`/emails/event-invitation/${idEvent.value}/${user.value.id}/${number.value}`);
                    if (response.data.success) {
                        alert('Запрошення успішно надіслано');
                    } else {
                        alert('Не вдалося надіслати запрошення. Або термін події вже пройшов');
                    }
                } catch (error) {
                    console.error('Помилка при надсиланні запрошення:', error);
                }
            }
        }

        return {
            user,
            idEvent,
            number,
            sendInvitation,
        };
    },
};
</script>
