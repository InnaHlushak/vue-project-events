<template>
    <div class="container">
        <v-card class="mx-auto border-card" max-width="340" color="white">
            <v-img :src="imageUrl" height="200px" cover />
            <v-card-subtitle>Категорія: {{ event.category }}</v-card-subtitle> 
            <v-card-title>{{ event.name }}</v-card-title>
            <v-card-subtitle>  {{ event.deadline }} </v-card-subtitle>
            <br>
            <v-row justify="end">
                <v-card-subtitle> Популярність:{{ event.popularity }}</v-card-subtitle>
            </v-row>
            <div>
                <v-row>
                    <v-col>
                        <v-btn color="indigo" variant="tonal" @click="show =!show">Детальніше</v-btn>
                    </v-col>
                    <v-spacer> </v-spacer>
                    <v-col>
                        <v-btn color="orange" variant="tonal" @click="increasePopularityAndRedirectTo">Відвідати</v-btn>
                    </v-col>
                </v-row>
            </div>

            <v-expand-transition>
                <div v-show="show">
                    <v-divider></v-divider>
                    <v-card-text class="pb-0">
                        <p class="text-h6">{{ event.name }}</p>
                        <p class="text-medium-emphasis">{{ event.venue }}</p>
                        <br>
                    </v-card-text>
                </div>
            </v-expand-transition>
        </v-card> 
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api';

export default {
    name: 'EventCard',
    props: {
        event: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const show = ref(false);
        const router = useRouter();

        const imageUrl = computed(() => {

            if (!props.event || !props.event.image) {
                return ''; // зображення відсутнє
            }

            return props.event.image; //шлях до зображення
        });

        const increasePopularityAndRedirectTo = async () => {
            try {
                const response = await apiClient.post(`/event/${props.event.id}/visit`);
                if (response.data.success) {
                    props.event.popularity += 1; // Оновлення локального значення
                    router.push({
                        name: 'event-description',
                        params: {
                            id: props.event.id,
                        },
                    });
                } else {
                    console.error('Не вдалося оновити популярність');
                }
            } catch (error) {
                console.error('Помилка при оновленні даних:', error);
            }
        };

        return {
            show,
            imageUrl,
            increasePopularityAndRedirectTo,
        };
    }
};
</script>

<style scoped>
    .border-card {
        border: 1px solid #8e8d8d; 
        padding: 20px;
        margin: 10px;
    }   
</style>