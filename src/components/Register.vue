<template>
    <div  class="container" >
        <h3> Реєстрація </h3>
        <v-sheet class="mx-auto" width="400" color="grey-lighten-4">
            <v-form @submit.prevent="saveForm">
                <div v-if="!isRegistered">
                    <v-text-field 
                    v-model="form.name"
                    label="Name"
                    ></v-text-field>
                    <span class="error">{{ errorName }}</span>
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
                    <v-text-field
                        v-model="form.password_confirmation"                     
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPass ? 'text' : 'password'"
                        @click:append="showPass = !showPass"
                        label="Confirm Password"
                    ></v-text-field>
                    <span class="error">{{ errorPassword }}</span>                 
                </div>
                <v-btn v-if="isRegistered" class="mt-2 issubmit" type="submit" block>Ви уже зареєстровані</v-btn>
                <v-btn v-else color="indigo" class="mt-2" :class="{issubmit: isRegistered}" type="submit" block>Sign Up</v-btn>
            </v-form>
        </v-sheet>
    </div>
</template>

<script>
import apiClient from '../api';
import { auth } from '../auth'; 

export default {
    name: 'Register',        
    data() {
        return {
            form: {
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
            },
            errorName: '',
            errorEmail: '',
            errorPassword: '',
            showPass: false,
            isValidForm: false,
            isRegistered: auth.getStatus(), //початковий статус авторизації користувача, застосовуючи м-д з модуля auth.js
            errors:[],
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
            this.isRegistered = auth.getStatus();
        },

        validateForm() {   
            if (this.form.name.trim().length < 3 ) {
                this.errorName = 'Name must be at least 3 characters';
                
                return;
            }

            this.errorName = '';

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
                this.textSubmitButton = "Sign in";
                alert('Введені дані збережено'); 
        },

        async saveForm() {
            this.validateForm();

            if (this.isValidForm) {

                try {
                    const response = await apiClient.post('/register', this.form);
                    console.log("Registration successful:", response.data);
                    const token = response.data.token;
                    //зберігання токена в LocalStorage, застосовуючи м-д з модуля auth.js
                    auth.logIn(token); 
                    // Оновлення  поточного статусу авторизації 
                    this.isRegistered = auth.getStatus(); 
                    alert('Реєстрація успішна!');
                    // Перенаправлення на роут
                    this.$router.push({name:"dashboard"});

                } catch (error) {
                    console.log("Registration failed:", error.response);
                    this.errors = error.response.data.errors;
                    alert('Виникла помилка. Можливо невірне підтвердження паролю. Або такий користувач уже зареєстрований');
                }
            } 
        },

        redirectToLogin() {
            this.$router.push({path: '/login'});
        }, 
    } ,

}
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