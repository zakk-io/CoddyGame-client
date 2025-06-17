import { createRouter, createWebHistory } from 'vue-router'

import TeamLayoutView   from '../layout/TeamLayoutView.vue'
import UsersLayoutView  from '../layout/UsersLayoutView.vue'

import WorkplaceView     from '../views/WorkplaceView.vue'
import TeamProfileView   from '../views/TeamProfileView.vue'
import MembersView       from '../views/Users/MembersView.vue'
import InvitationsView   from '../views/Users/InvitationsView.vue'
import JoinRequestsView  from '../views/Users/JoinRequestsView.vue'

const routes = [
  {
    path: '/teams/:team_id',
    component: TeamLayoutView,
    name: 'team-layout',
    children: [
      {
        path: 'workplace',
        name: 'workplace',
        component: WorkplaceView,
      },
      {
        path: 'settings',
        name: 'team-settings',
        component: TeamProfileView,
      },
      {
        // this is the "users" sub-layout
        path: 'users',
        component: UsersLayoutView,
        children: [
          {
            path: 'members',        // /teams/:team_id/users/members
            name: 'members',
            component: MembersView,
          },
          {
            path: 'invitations',    // /teams/:team_id/users/invitations
            name: 'invitations',
            component: InvitationsView,
          },
          {
            path: 'join-requests',  // /teams/:team_id/users/join-requests
            name: 'join-requests',
            component: JoinRequestsView,
          },
        ],
      },
    ],
  },
  // …other top-level routes (login, about, etc)…
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
