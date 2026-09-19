import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../stores/auth'
import AppShell from '../views/AppShell.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import TicketListView from '../views/TicketListView.vue'
import TicketCreateView from '../views/TicketCreateView.vue'
import TicketDetailView from '../views/TicketDetailView.vue'
const router = createRouter({ history: createWebHistory(), routes: [
  { path: '/login', component: LoginView, meta: { public: true } },
  { path: '/register', component: RegisterView, meta: { public: true } },
  { path: '/', component: AppShell, meta: { requiresAuth: true }, children: [
    { path: '', redirect: '/tickets/mine' },
    { path: 'tickets', name: 'tickets', component: TicketListView, meta: { roles: ['AGENT', 'ADMIN'] } },
    { path: 'tickets/mine', name: 'my-tickets', component: TicketListView },
    { path: 'tickets/create', name: 'ticket-create', component: TicketCreateView },
    { path: 'tickets/:id', name: 'ticket-detail', component: TicketDetailView },
  ] },
  { path: '/:pathMatch(.*)*', redirect: '/' },
] })
router.beforeEach((to) => { if (to.meta.public) { if (auth.isAuthenticated.value && (to.path === '/login' || to.path === '/register')) return '/'; return true }; if (!auth.isAuthenticated.value) return { path: '/login', query: { redirect: to.fullPath } }; const roles = to.meta.roles as string[] | undefined; if (roles && (!auth.role.value || !roles.includes(auth.role.value))) return '/tickets/mine'; return true })
export default router
