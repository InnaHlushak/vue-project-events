<template>
    <div class="container">
        <h3>Вхід</h3>
        <v-sheet  v-if="!isLoggedIn" class="mx-auto" width="400" color="grey-lighten-4">
            <v-form @submit.prevent="loginUser">
                <div v-if="!isLoggedIn">
                    <v-text-field
                        v-model="form.email"
                        placeholder="text@text.text"
                        label="E-mail"
                    ></v-text-field>
                    <span class="error">{{ errorEmail }}</span>
                    <v-text-field
                        v-model="form.password"                     
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPass ? 'text' : 'password'"
                        @click:append="showPass = !showPass"
                        label="Password"
                    ></v-text-field>
                    <span class="error">{{ errorPassword }}</span>                
                </div> 
                <v-btn  color="indigo" class="mt-2" type="submit" block>Login</v-btn>
            </v-form>
            <p>Ви ще не зареєстровані?</p>
            <v-btn  color="indigo" class="mt-2" block @click="redirectToRegister">Реєстрація</v-btn>
        </v-sheet>
        <v-sheet  v-else  class="mx-auto" width="400" color="grey-lighten-4">
            <v-btn  class="mt-2 issubmit"  block>Ви уже авторизовані</v-btn>
        </v-sheet>
    </div>
</template>

<script>
import apiClient from '../api';
import { auth } from '../auth'; 


export default {
    name: 'Login',        
    data() {
        return  {
            form: {
                email: '',
                password: '',
            },
            errorEmail: '',
            errorPassword: '',
            showPass: false,
            isValidForm: false,
            isLoggedIn: auth.getStatus(), //початковий статус авторизації користувача, застосовуючи м-д з модуля auth.js
            errors: [],
        }
    },

    mounted() {
        // щоб слухати подію storage для синхронізації статусу
        window.addEventListener('storage', this.updateStatus);
    },

    beforeUnmount() {
        // щоб відписатися від події storage
        window.removeEventListener('storage', this.updateStatus);
    },

    methods: {
        updateStatus() {
            this.isLoggedIn = auth.getStatus();
        },

        validateForm() {   
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

            if (!emailRegex.test(this.form.email)) {
                this.errorEmail = 'Must be a valid e-mail';

                return;
            }

            this.errorEmail= '';
            
            const passwordRegex = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}/g; 

            if (!this.form.password || !passwordRegex.test(this.form.password)) {
                this.errorPassword = 'The password must contain at least 8 characters, at least one capital letter and at least one number';
                
                return;
            } 

            this.errorPassword= '';

            this.isValidForm = true;           
        },

        //вхід користувача
        async loginUser() {
            try {
                const response = await apiClient.post('/login', this.form);
                console.log("Login successful:", response.data);
                const token = response.data.token;
                //зберігання токена в LocalStorage, застосовуючи м-ди з модуля auth.js
                auth.logIn(token); 
                // Оновлення  поточного статусу авторизації isLoggedIn
                this.isLoggedIn = auth.getStatus(); 
                alert('Вхід успішний!');
                //перенаправлення на сторінку Dashboard
                this.$router.push({ name: 'dashboard' });
            } catch (error) {
                console.error('Login failed:', error.response);
                this.errors = error.response?.data?.errors || [];
                alert('Виникла помилка. Можливо невірно вказані логін/пароль або ви ще не зареєстровані');
            }
        },

        //перенаправлення на сторінку реєстрації
        redirectToRegister() {
            this.$router.push({path: '/register'});
        },
    },
};
</script>

<style scoped>
    .error {
        color:red;
    }  

    .issubmit {
        background-color: green;
        cursor: not-allowed;
        pointer-events: none;
    }     
</style>