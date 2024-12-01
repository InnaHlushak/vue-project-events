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
                    <router-link to="/">
                        <v-btn v-if="!isLogged" color="orange" class="navigation-btn">Увійти</v-btn>
                    </router-link>
                    <router-link to="/">
                        <v-btn v-if="isLogged" color="orange" class="navigation-btn">Вийти</v-btn>
                    </router-link>
                </v-col>
            </v-row>    
        </v-container>
    </div>
  </template>
  
  <script>
    export default {
        name: 'NavigationBar',
        data() {
        return  {
            isLogged: false,
        }
        },
    }
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
  