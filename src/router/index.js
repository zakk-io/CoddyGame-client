import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../util/auth.js'

import TeamLayoutView   from '../layout/TeamLayoutView.vue'
import UsersLayoutView  from '../layout/UsersLayoutView.vue'
import TeamsListLayout  from '../layout/TeamsListLayout.vue'
import LoginLayout  from '../views/authentication/LoginView.vue'
import RegisterLayout  from '../views/authentication/RegisterView.vue'
import BoardsLayout  from '../layout/BoardsLayout.vue'





import WorkplaceView     from '../views/WorkplaceView.vue'
import TeamProfileView   from '../views/TeamProfileView.vue'
import MembersView       from '../views/Users/MembersView.vue'
import InvitationsView   from '../views/Users/InvitationsView.vue'
import JoinRequestsView  from '../views/Users/JoinRequestsView.vue'


import CodebaseView  from '../views/boards/CodebaseView.vue'
import DocumentView  from '../views/boards/DocumentView.vue'
import WhitboardView  from '../views/boards/WhitboardView.vue'




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

      {
        path: 'boards',
        component: BoardsLayout,
        children: [
          {
            path: 'codebase/:codebase_id',
            component: CodebaseView,
          },
          {
            path: 'document/:document_id',
            component: DocumentView,
          },
          {
            path: 'whiteboard/:whiteboard_id',
            component: WhitboardView,
          },
        ],
      },
    ],
  },
  {
    path: '/',    
    name: 'teams-lists',
    component: TeamsListLayout,
  },
  {
    path: '/login',    
    name: 'login',
    component: LoginLayout,
    meta: { public: true },
  },
  {
    path: '/register',    
    name: 'register',
    component: RegisterLayout,
    meta: { public: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})



router.beforeEach(async (to, from, next) => {
  if (to.meta.public) return next();
  try {
    const res = await fetch(`${API_BASE_URI}/api/auth/me`, {
      credentials: 'include'
    });
    if (res.ok) return next();
  } catch (e) {}
  return next({ name: 'login' });
});






export default router

