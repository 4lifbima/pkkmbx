import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AgendaView from '../views/AgendaView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/agenda', name: 'agenda', component: AgendaView },
    { path: '/tentang', name: 'about', component: AboutView },
    { path: '/kontak', name: 'contact', component: ContactView },
  ],
})

export default router
