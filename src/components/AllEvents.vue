<template>
    <h2>Найближчі події:</h2>
    <div class="container">
        <div>
            <v-container>
                <v-row>
                    <v-col v-for="event in listEvents" :key="event.id">
                        <EventCard :event="event" />
                    </v-col>
                </v-row>
                <v-pagination v-if="currentPage > 0"
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
    name: 'AllEvents',
    components: {
        EventCard,
    },
    setup() {
        // const events = ref([]);
        const listEvents = ref([]);
        const parametersPagination = ref([]);

        // const getEvents = async () => {
        //     try {
        //     const response = await apiClient.get('/index');       
        //     events.value = response.data.data;
        //     } catch (error) {
        //     console.error('Помилка завантаження даних:', error);
        //     }
        // }

        const getParametersPagination = async () => {
            try {
            const response = await apiClient.get('/index');       
            parametersPagination.value = response.data.meta;
            } catch (error) {
            console.error('Помилка завантаження даних:', error);
            }
        }

        // Завантаження даних для монтування
        onMounted(
            getParametersPagination,
            // getEvents,
        );

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
            const response = await apiClient.get('/index?page=' + numberPage);
            listEvents.value = response.data.data;            
            } catch (error) {
            console.error('Помилка завантаження даних:', error);
            }
        }

        //встановити спостерігач на реактивну змінну currentPage
        watch(currentPage, (newValue) => {
            getPaginatedList(newValue);
        });

        return {
            // events,
            currentPage,
            lastPage,
            listEvents,
        };
    },
};
</script>