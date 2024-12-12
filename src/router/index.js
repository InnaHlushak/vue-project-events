import { createRouter, createWebHistory } from 'vue-router';
import Hello from '../components/Hello.vue'
import EventDescription from '../components/EventDescription.vue'
import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'

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
    },
  ]
})

export default router;
