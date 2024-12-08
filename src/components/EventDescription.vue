<template>
    <!-- <p>Опис події  з  ID {{ $route.params.id }}</p> -->
    <div v-if="event.length != 0" class="container">
    <v-card class="mx-auto" max-width="100vw" color="white">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <div class="d-flex flex-no-wrap justify-space-around">
                        <v-sheet width="45vw">
                            <v-img 
                                :src="event.image"
                                cover 
                            />
                            <p class="text-h6">Про подію</p>
                            <v-card-text>
                                {{ event.description }}
                            </v-card-text>
                        </v-sheet>
                        <v-sheet color="grey-lighten-4" width="30vw">
                            <v-card-text class="pb-0">
                                <p class="text-h6">{{ event.name }}</p>
                                <p class="text-h6">{{ event.deadline }}</p>
                                <p class="text-medium-emphasis">{{ event.venue }}</p>
                            </v-card-text>
                            <v-card-text class="pb-0">
                                <div v-if="maxPrice">
                                    <p class="text-uppercase">Вартість квитка:</p>
                                    <v-form >
                                        <div v-for="cost in event.costs" :key="cost.name">
                                            <div v-if="cost.price != 0">
                                                <input type="radio" :id="cost.name" :value="cost" v-model="form.picked" />
                                                <label :for="cost.name">{{ cost.full_cost }}</label>
                                            </div>
                                        </div>
                                        <br>
                                        <p v-if="form.picked">Ви обрали квиток вартістю {{ form.picked.price }} грн.</p>
                                        <br>
                                        <div>
                                            <input type="checkbox" id="checkbox" v-model="form.checked" />
                                            <label for="checkbox">Оплата карткою</label>
                                        </div>
                                        <span class="remark">При безготівковій оплаті гарантується знижка 5%</span>
                                        <br>
                                        <v-btn class="mt-2"  type="submit" color="indigo" > Купити квиток </v-btn>
                                    </v-form>
                                </div>
                                <div v-else="maxPrice">
                                    <p class="text-uppercase">Безкоштовно</p>
                                    <br>
                                    <v-btn class="mt-2"  type="submit" color="indigo"> Хочу відвідати </v-btn>
                                </div>    
                            </v-card-text>
                        </v-sheet>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
    </div>
</template>

<script>
import { ref, toRefs, reactive, computed, onMounted, watch} from 'vue'
import apiClient from '../api';

export default {
    name: 'EventDescription',
    props: ['id'],
    setup(props) {
        const id  = ref(props);

        const event = ref([]);

        const getEvent = async () => {
            try {
            const response = await apiClient.get('/event/' + id.value.id);       
            event.value = response.data.data;
            } catch (error) {
            console.error('Помилка завантаження даних:', error);
            }
        }

        onMounted(
            getEvent,
        );

        const  maxPrice = computed(() => {
            let price = 0;
            for(const cost of event.value.costs) {
                if (cost.price > price) {
                    price = cost.price;
                }
            }
            return price;
        });

        const form = reactive({
            picked: '',
            checked: false,
        });

        return {
           id,
           event, 
           form,
           maxPrice,
        } 
    }
}
</script>

<style scoped>
    .remark {
        margin: 2px;
        color:gray;
    }   
</style>