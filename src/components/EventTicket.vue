<template>
    <div v-if="user" class="container">
        <v-sheet class="mx-auto" max-width="700" color="grey-lighten-4">
            <v-row justify="center">
                <p>Вітаємо, {{ user.name }}!</p>
                <p>Квиток  буде надіслано на Вашу поштову скриньку {{ user.email }}</p>
            </v-row>
        <v-row justify="center">
            <v-btn class="mt-2"  type="submit" color="indigo" @click="sendTicket"> Надіслати квиток </v-btn>
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
    name: 'EventTicket',
    props: {
        id: {
            type: [String, Number],
            required: true,
        },
        type: {
            type: [String],
            required: true,
        },
        price: {
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
        const typeTicket = ref(props.type);
        const finalPrice = ref(props.price);
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

        const sendTicket = async () => {
            if (idEvent.value && user.value) {
                try {
                const response = await apiClient.get(`/emails/event-ticket/${idEvent.value}/${user.value.id}/${typeTicket.value}/${finalPrice.value}/${number.value}`);
                    if (response.data.success) {
                        alert('Квиток успішно надіслано');
                    } else {
                        alert('Не вдалося надіслати квиток');
                    }
                } catch (error) {
                    console.error('Помилка при надсиланні квитка:', error);
                }
            }
        }

        return {
            user,
            idEvent,
            typeTicket,
            finalPrice,
            number,
            sendTicket,
        };
    },
};
</script>
