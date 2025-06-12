import { createRouter, createWebHistory } from 'vue-router'
import WorkplaceView from '../views/WorkplaceView.vue'
import TeamProfileView from '../views/TeamProfileView.vue'
import MembersView from '../views/Users/MembersView.vue'
import InvitationsView from '../views/Users/InvitationsView.vue'
import JoinRequestsView from '../views/Users/JoinRequestsView.vue'






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

    {
      path: '/teams/users/members',
      name: 'members',
      component: MembersView,
    },
    {
      path: '/teams/users/invitations',
      name: 'invitations',
      component: InvitationsView,
    },
    {
      path: '/teams/users/join-requests',
      name: 'join-requests',
      component: JoinRequestsView,
    },
  ],
})

export default router
