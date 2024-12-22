<template>
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
                            <v-card-text  v-if="!alreadyPassed" class="pb-0">
                                <div v-if="maxPrice">
                                    <p class="text-uppercase">Вартість квитка:</p>
                                    <v-form>
                                        <div v-for="cost in event.costs" :key="cost.name">
                                            <div v-if="cost.price != 0">
                                                <input type="radio" :id="cost.name" :value="cost" v-model="form.picked" />
                                                <label :for="cost.name">{{ cost.full_cost }}</label>
                                            </div>
                                        </div>
                                        <br>
                                        <p v-if="form.picked">Ви обрали квиток вартістю {{ form.picked.price }} грн.</p>
                                        <p v-else class="warning"> Оберіть тип квитка!</p>
                                        <br>
                                        <div>
                                            <input type="checkbox" id="checkbox" v-model="form.checked" />
                                            <label for="checkbox">Оплата карткою</label>
                                        </div>
                                        <span class="remark">При безготівковій оплаті гарантується знижка 5%</span>
                                        <br>
                                        <v-btn
                                            class="mt-2"  
                                            type="button" 
                                            color="indigo" 
                                            @click="getTicket"
                                            > 
                                                Купити квиток 
                                            </v-btn>
                                    </v-form>
                                </div>
                                <div v-else="maxPrice">
                                    <p class="text-uppercase">Безкоштовно</p>
                                    <br>
                                    <v-btn
                                        class="mt-2"  
                                        type="submit" 
                                        color="indigo" 
                                        @click="getInvitation"
                                    > 
                                        Отримати запрошення 
                                    </v-btn>
                                </div>    
                            </v-card-text>
                            <v-card-text  v-else class="pb-0">
                                <p class="warning"> Подія уже відбулася!</p>
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
import { useRouter } from 'vue-router';
import apiClient from '../api';

export default {
    name: 'EventDescription',
    props: ['id'],
    setup(props) {
        const router = useRouter();
        const id  = ref(props);

        const event = ref([]); //подія        
        const number = ref(0); // поточна кількість учасників
        const alreadyPassed = ref(false); //true якщо  подія відбулася
        
        const getEvent = async () => {
            try {
            const response = await apiClient.get('/event/' + id.value.id); 
            if (response.data.data) {      
                event.value = response.data.data;
                number.value = event.value.number;
                
                // Перетворення дати у формат YYYY-MM-DDTHH:mm:ss
                const deadlineString = event.value.deadline; 
                const [day, month, year, time] = deadlineString.split(/[\s-:]/);
                const formattedDate = `${year}-${month}-${day}T${time}:00`;
                // Порівняння дедлайну із поточною датою            
                const deadlineDate = new Date(formattedDate)
                const now = new Date();
                alreadyPassed.value = (deadlineDate < now);
            }
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

        const increaseNumberParticipants = async () => {
            try {
                const response = await apiClient.post(`/event/${id.value.id}/participate`);
                if (response.data.success) {
                    number.value++; 
                } else {
                    console.error('Не вдалося оновити кількість');
                }
            } catch (error) {
                console.error('Помилка при оновленні даних:', error);
            }
        };

        const getInvitation = async () => {
            await increaseNumberParticipants();

            const invitationDetails = {
                id: props.id,
                number: number.value,
            };

            router.push({
                name: 'event-invitation',
                params: invitationDetails,
            });
        }

        const form = reactive({
            picked: '',
            checked: false,
        });

        const finalPrice = computed(() => {
            let price = form.picked.price;

            if (form.checked) {
                const discount = 0.05;
                price *= 1 - discount; 
            }

            return price;
        });

        const getTicket =  async() => {
            
            if (!form.picked.name) {
                alert("Оберіть тип квитка!");
                return;
            }

            await increaseNumberParticipants();

            const ticketDetails = {
                id: props.id,
                type: form.picked.name,
                price: finalPrice.value,
                number: number.value,
            };

            router.push({
                name: 'event-ticket',
                params: ticketDetails,
            });
        }

        return {
           id,
           event,
           alreadyPassed,
           form,
           maxPrice,
           number,
           increaseNumberParticipants,
           getInvitation,
           getTicket,
        } 
    }
}
</script>

<style scoped>
    .remark {
        margin: 2px;
        color:gray;
    }  
    .warning {
        margin: 2px;
        color:red;
    }    
</style>