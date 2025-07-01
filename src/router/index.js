import { createRouter, createWebHistory } from 'vue-router'

import TeamLayoutView   from '../layout/TeamLayoutView.vue'
import UsersLayoutView  from '../layout/UsersLayoutView.vue'
import TeamsListLayout  from '../layout/TeamsListLayout.vue'
import LoginLayout  from '../layout/LoginLayout.vue'
import RegisterLayout  from '../layout/RegisterLayout.vue'
import BoardsLayout  from '../layout/BoardsLayout.vue'





import WorkplaceView     from '../views/WorkplaceView.vue'
import TeamProfileView   from '../views/TeamProfileView.vue'
import MembersView       from '../views/Users/MembersView.vue'
import InvitationsView   from '../views/Users/InvitationsView.vue'
import JoinRequestsView  from '../views/Users/JoinRequestsView.vue'


import CodebaseView  from '../views/boards/CodebaseView.vue'


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
            path: 'codebase',
            component: CodebaseView,
          }
        ],
      },
    ],
  },
  {
    path: '/teams/lists',    
    name: 'teams-lists',
    component: TeamsListLayout,
  },
  {
    path: '/login',    
    name: 'login',
    component: LoginLayout,
  },
  {
    path: '/register',    
    name: 'register',
    component: RegisterLayout,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})




router.beforeEach(async (to, from, next) => {
  // Skip check for public routes like login/register if needed
  const publicPaths = ['/login', '/register'];
  if (publicPaths.includes(to.path)) return next();

  try {

    // Optional: check for team membership on team routes
    if (to.path.startsWith('/teams/')) {
      const teamId = to.params.team_id || to.path.split('/')[2];
      const teamRes = await fetch(`${import.meta.env.VITE_API_BASE_URI}/api/teams/${teamId}/members/me`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });

      const teamResult = await teamRes.json();
      if (teamResult.code === 403) {
        const { useToast } = await import('vue-toast-notification');
        const toast = useToast();
        toast.error('You are not a member of this team.');
        return next('/teams/lists');
      }
    }

    next(); // Authenticated and allowed
  } catch (err) {
    console.error('Auth check failed:', err);
    return next('/login'); // Fallback: redirect on error
  }
});




export default router

