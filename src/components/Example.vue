<template>
    <h1>Message from </h1>
    <p> {{ message }} </p>
</template>

<script>
import { ref, toRefs, reactive, onMounted, watch} from 'vue';
import apiClient from '../api';

export default {
    name: 'Example',
    setup() {
        const  message = ref('');

        //щоб  запит до АРІ спрацював коли компонент буде монтуватися треба звернутися до хукі життєвого циклу mounted
        onMounted( async() => {
            const response = await apiClient.get('/example');
            message.value = response.data.message;
            // const response = await apiClient.get('/index');
            // message.value = response.data;
        });

        //все що повертається return є доступним у шаблоні компонента 
        //(та при потребі в інших частинах компонента (тобто поза setup))
        return {message};
    },
};
</script>