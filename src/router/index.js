import { createRouter, createWebHistory } from 'vue-router'
import WorkplaceView from '../views/WorkplaceView.vue'
import TeamProfileView from '../views/TeamProfileView.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/teams/workplace',
      name: 'workplace',
      component: WorkplaceView,
    },
    {
      path: '/teams/settings',
      name: 'team-settings',
      component: TeamProfileView,
    },
  ],
})

export default router
