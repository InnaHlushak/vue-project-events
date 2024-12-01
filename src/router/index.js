import { createRouter, createWebHistory } from 'vue-router';
import Hello from '../components/Hello.vue'
import EventDescription from '../components/EventDescription.vue'

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
  ]
})

export default router;
