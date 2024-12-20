<template>
    <div class="container">
        <div class="d-flex justify-end" style="width: 100%;">
            <v-container max-width="40vw" style="margin-right: 0;">
                <v-row class="d-flex justify-end align-center">
                    <v-text-field
                        v-model="text"
                        label="Введіть текст для пошуку"
                        placeholder="текст"
                        type="text"
                        class="cursor-pointer"
                        style="margin: 0; height: 50px;" 
                    />
                    <v-btn 
                        color="green" 
                        variant="tonal"
                        style="height: 50px; align-self: center; margin-left: 8px;"
                        @click="getInfo" 
                    > 
                        Знайти
                    </v-btn>
                </v-row>
            </v-container>
        </div>

        <div>
            <v-container v-if="listEvents.length">
                <v-row >
                    <v-col v-for="event in listEvents" :key="event.id">
                        <EventCard :event="event" />
                    </v-col>
                </v-row>
                <v-pagination v-if="lastPage > 1"
                    v-model="currentPage"
                    :length="lastPage"
                    :total-visible="8"
                ></v-pagination>
            </v-container> 
        </div>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, onMounted, watch} from 'vue';
import apiClient from '../api';
import EventCard from './EventCard.vue'

export default {
    name: 'SiteSearch',
    components: {
        EventCard,
    },
    setup() {
        const text = ref('');

        //Проста логіка (без пагінації)
        // const events = ref([]);

        // const getEvents = async () => {

        //     if (!text.value.trim()) {
        //         console.warn('Поле пошуку порожнє');
        //         events.value = []; 
        //         return;
        //     }

        //     try {
        //     const response = await apiClient.post(`/events/search/${text.value}`);       
        //     events.value = response.data.data;
        //     } catch (error) {
        //     console.error('Помилка завантаження даних:', error);
        //     }
        // }

        // Логіка із пагінацією
        const listEvents = ref([]);
        const parametersPagination = ref([]);

        const getParametersPagination = async () => {
            listEvents.value = [];

            if (!text.value.trim()) {
                console.warn('Поле пошуку порожнє');
                parametersPagination.value = []; 
                return;
            }

            try {
            const response = await apiClient.post(`/events/search/${text.value}`);       
            parametersPagination.value = response.data.meta;
            } catch (error) {
            console.error('Помилка завантаження даних:', error);
            }
        }

        //Параметри для пагінації
        const currentPage = computed({
            get: () => parametersPagination.value.current_page,
            //двостороннє зв'язування з v-model
            set: (value) => {
            parametersPagination.value.current_page = value; 
            },
        });

        const lastPage = computed(() => parametersPagination.value.last_page);

        //Пагінований список
        const getPaginatedList = async (numberPage) => {
            try {
            const response = await apiClient.post(`/events/search/${text.value}?page=` + numberPage);
            listEvents.value = response.data.data;            
            } catch (error) {
            console.error('Помилка завантаження даних:', error);
            }
        }

        //Cпостерігач на реактивну змінну currentPage (поточна сторінка пагінатора)
        watch(currentPage, (newValue) => {
            getPaginatedList(newValue);
        });

        //Основна функція яка викликається подією @click кнопки Знайти
        const getInfo = async () => {
            await getParametersPagination(),
            await getPaginatedList(currentPage.value)
        }

        return {
            text,
            // events,
            getParametersPagination,
            currentPage,
            lastPage,
            listEvents,
            getInfo,           
        };
    },
};
</script>