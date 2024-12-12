<template>
    <div class="wrapper">
        <div class="greetings">
            <div>
                <h1>Місто, в якому вирує життя</h1>
                <h2>Гостинно запрошує відвідати події та заходи</h2>
                <!-- <Example /> -->
            </div>
        </div>
        <PopularEvents /> 
        <AllEvents /> 
    </div>
</template>

<script>
import PopularEvents from './PopularEvents.vue'
import AllEvents from './AllEvents.vue'

export default {
    name: 'Hello',
    components: {
        PopularEvents,
        AllEvents,
    },
}
</script>

<style scoped>
    .greetings {
        height: 35vh;
        background: url('../assets/ivfr.jpg') no-repeat center;
        background-size: cover;
        display:flex;
        flex-direction: column; 
        justify-content:space-around;
        align-items:flex-start;
        color: white;
    }
</style>
