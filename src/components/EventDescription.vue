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
                            src="https://storage.concert.ua/JTU/8/De/6704e41c6a22e/a230.jpg:31-catalog-event_item-desktop2x" 
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
                                <p class="text-uppercase">Вартість квитка:</p>
                                <v-form >
                                <div>
                                    <input type="radio" id="type1" value="type1" v-model="form.picked" />
                                    <label for="type1">Ряд 1 - 100 грн.</label>
                                    <br/>
                                    <input type="radio" id="type2" value="type2" v-model="form.picked" />
                                    <label for="type2">Ряд 2 - 200 грн.</label>
                                    <br/>
                                    <input type="radio" id="type3" value="type3" v-model="form.picked" />
                                    <label for="type3">Ряд 3 - 300 грн.</label>
                                </div>
                                <br>
                                <div>
                                    <input type="checkbox" id="checkbox" v-model="form.checked" />
                                    <label for="checkbox">Оплата карткою</label>
                                </div>
                                <span class="remark">При безготівковій оплаті гарантується знижка 5%</span>
                                <br> 
                                <v-btn class="mt-2"  type="submit" color="indigo" > Купити квиток </v-btn>
                                </v-form>
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
import { ref, toRefs, reactive, onMounted, watch} from 'vue'
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

        const form = reactive({
            picked: '',
            checked: false,
        });

        return {
           id,
           event, 
           form,
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