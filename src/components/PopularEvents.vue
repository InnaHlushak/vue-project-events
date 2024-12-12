<template>
    <h2>Топ-добірка:</h2>
    <div class="container">
        <div>
            <v-container>
                <v-row>
                    <v-col v-for="event in events" :key="event.id">
                        <EventCardModal :event="event" />
                    </v-col>
                </v-row>
            </v-container> 
        </div>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, onMounted, watch} from 'vue';
import apiClient from '../api';
import EventCardModal from './EventCard.vue'


export default {
    name: 'PopularEvents',
    components: {
        EventCardModal,
    },
    setup() {
        const events = ref([]);

        const getEvents = async () => {
            try {
            const response = await apiClient.get('/popular');       
            events.value = response.data.data;
            } catch (error) {
            console.error('Помилка завантаження даних:', error);
            }
        }

        // Завантаження даних для монтування
        onMounted(
            getEvents,
        );

        return {
            events,
        };
    },
};
</script>