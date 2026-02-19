import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import reveal from './directives/reveal'
import { useAuthStore } from './stores/auth'

const bootstrap = async () => {
  const auth = useAuthStore()
  await auth.init()
  createApp(App).use(router).directive('reveal', reveal).mount('#app')
}

bootstrap()
