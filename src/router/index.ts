import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AgendaView from '../views/AgendaView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminDashboardView from '../views/admin/AdminDashboardView.vue'
import StudentDashboardView from '../views/student/StudentDashboardView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/agenda', name: 'agenda', component: AgendaView },
    { path: '/tentang', name: 'about', component: AboutView },
    { path: '/kontak', name: 'contact', component: ContactView },
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },
    {
      path: '/dashboard-admin',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/dashboard-mahasiswa',
      name: 'student-dashboard',
      component: StudentDashboardView,
      meta: { requiresAuth: true, role: 'student' },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.state.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && auth.state.user) {
    return auth.state.user.role === 'admin'
      ? { name: 'admin-dashboard' }
      : { name: 'student-dashboard' }
  }

  if (to.meta.role && auth.state.user?.role !== to.meta.role) {
    return auth.state.user?.role === 'admin'
      ? { name: 'admin-dashboard' }
      : { name: 'student-dashboard' }
  }

  return true
})

export default router
