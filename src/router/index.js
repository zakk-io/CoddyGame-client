import { createRouter, createWebHistory } from 'vue-router'
import WorkplaceView from '../views/WorkplaceView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/teams/workspace',
      name: 'workplace',
      component: WorkplaceView,
    },
    {
      path: '/',
      redirect: '/teams/workspace',
    },
  ],
})

export default router
