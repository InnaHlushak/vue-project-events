<template>    
    <div>
        <v-container >
            <v-row justify="space-between">
                <img  class="logo" src="../assets/logo-ivfr.png"  alt="Ivano-Frankivsk logo" width="75" height="75" />
              <v-col>
                  <v-tab
                  align-tabs="start"
                  color="indigo"
                  href="https://iftravel.com.ua/"
                  target="_blank"
                  >
                  Івано-Франківськ
                  </v-tab>
              </v-col>
              <v-spacer />
                <v-col>
                    <router-link to="/">
                        <v-btn  color="indigo" class="navigation-btn">Головна</v-btn>
                    </router-link>
                    <router-link to="/login">
                        <v-btn v-if="!isLogged" color="orange" class="navigation-btn">Увійти</v-btn>
                    </router-link>
                        <v-btn v-if="isLogged" color="orange"  class="navigation-btn" @click="logOut">Вийти</v-btn>
                </v-col>
            </v-row>    
        </v-container>
    </div>
  </template>
  
<script>
import { auth } from '../auth';

export default {
    name: 'NavigationBar',
    data() {
        return {
            isLogged: auth.getStatus(), 
        };
    },
    methods: {
        logOut() {
            auth.logOut();
            this.isLogged = false;
            alert('Ви вийшли');
            //перенаправлення на сторінку login
            this.$router.push({ name: 'login' });
        },
        updateLoggedStatus() {
            this.isLogged = auth.getStatus();
        },
    },
    mounted() {
        // Слухаємо подію storage, яка  генерується автоматично при зміні значення в localStorage
        window.addEventListener('storage', this.updateLoggedStatus);
    },
    beforeUnmount() {
        // Відписуємося від події
        window.removeEventListener('storage', this.updateLoggedStatus);
    },
};
</script>

  
<style scoped>  
    .logo {
    display: block;
    margin: 0 2rem 0 0;
    }

    .navigation-btn {
        margin: 2px;
    }
</style>
  