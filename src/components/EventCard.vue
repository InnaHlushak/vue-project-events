<template>
    <div class="container">
        <v-card class="mx-auto border-card" max-width="340" color="white">
            <v-img :src="imageUrl" height="200px" cover />
            <v-card-subtitle>Категорія: {{ event.category }}</v-card-subtitle> 
            <v-card-title>{{ event.name }}</v-card-title>
            <v-card-subtitle>  {{ event.deadline }} </v-card-subtitle>
            <div>
                <v-row>
                    <v-col>
                        <v-btn color="indigo" variant="tonal" @click="show =!show">Детальніше</v-btn>
                    </v-col>
                    <v-spacer> </v-spacer>
                    <v-col>
                        <v-btn color="orange" variant="tonal" @click="redirectTo(event)">Відвідати</v-btn>
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

        const redirectTo = (event) => {
            router.push({
                name: 'event-description',
                params: {
                    id: event.id,
                },
            });
        };

        return {
            show,
            imageUrl,
            redirectTo,
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