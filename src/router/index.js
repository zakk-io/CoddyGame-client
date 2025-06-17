import { createRouter, createWebHistory } from 'vue-router'

import TeamLayoutView     from '../layout/TeamLayoutView.vue'


import WorkplaceView     from '../views/WorkplaceView.vue'
import TeamProfileView   from '../views/TeamProfileView.vue'
import MembersView       from '../views/Users/MembersView.vue'
import InvitationsView   from '../views/Users/InvitationsView.vue'
import JoinRequestsView  from '../views/Users/JoinRequestsView.vue'

const routes = [
  {
    path: '/teams/:team_id',
    component:TeamLayoutView,
    name: 'team-layout',
    children: [
      {
        path: 'workplace',       // becomes /teams/:team_id/workplace
        name: 'workplace',
        component: WorkplaceView,
      },
      {
        path: 'settings',        // /teams/:team_id/settings
        name: 'team-settings',
        component: TeamProfileView,
      },
      {
        path: 'users/members',   // /teams/:team_id/users/members
        name: 'members',
        component: MembersView,
      },
      {
        path: 'users/invitations',
        name: 'invitations',
        component: InvitationsView,
      },
      {
        path: 'users/join-requests',
        name: 'join-requests',
        component: JoinRequestsView,
      },
    ]
  },

  // …you can still have other top-level routes here (login, about, etc)
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
