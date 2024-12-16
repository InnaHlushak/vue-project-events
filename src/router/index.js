import { createRouter, createWebHistory } from 'vue-router';
import Hello from '../components/Hello.vue'
import EventDescription from '../components/EventDescription.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import EventInvitation from '../components/EventInvitation.vue'
import EventTicket from '../components/EventTicket.vue'
import apiClient from '../api';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Hello,
    },
    {
      path: '/event-description/:id', 
      name: 'event-description',
      component: EventDescription, 
      props: true,
    },
    {
      path: '/register',
      name: 'register',
      component: Register, 
    },
    {
        path: '/login',
        name: 'login',
        component: Login, 
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard, 
      beforeEnter: (to, from, next) => {
        apiClient.get('/athenticated').then(()=>{
          next()
        }).catch(()=>{
          return next({name:'login'})
        })
      }
    },
    {
      path: '/event-invitation/:id/:number',
      name: 'event-invitation',
      component: EventInvitation, 
      props: true,
      beforeEnter: (to, from, next) => {
        apiClient.get('/athenticated').then(()=>{
          next()
        }).catch(()=>{
          return next({name:'login'})
        })
      }
    },
    {
      path: '/event-ticket/:id/:type/:price/:number',
      name: 'event-ticket',
      component: EventTicket, 
      props: true,
      beforeEnter: (to, from, next) => {
        apiClient.get('/athenticated').then(()=>{
          next()
        }).catch(()=>{
          return next({name:'login'})
        })
      }
    },
  ]
})

export default router;
