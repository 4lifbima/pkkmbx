<script setup lang="ts">
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRoute, useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const submitLogin = async () => {
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    const user = await auth.login(email.value, password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
    if (redirect) {
      await router.push(redirect)
      return
    }
    await router.push(user.role === 'admin' ? '/dashboard-admin' : '/dashboard-mahasiswa')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Login gagal.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Header />
  <main class="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
    <section class="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h1 class="text-2xl font-bold text-slate-900">Login</h1>
      <p class="mt-2 text-sm text-slate-600">Masuk sebagai admin atau mahasiswa.</p>

      <form class="mt-6 space-y-4" @submit.prevent="submitLogin">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-primary/20 transition focus:border-primary focus:ring"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-primary/20 transition focus:border-primary focus:ring"
          />
        </div>
        <p v-if="errorMessage" class="text-sm font-medium text-red-500">{{ errorMessage }}</p>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ isSubmitting ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>

      <p class="mt-4 text-sm text-slate-600">
        Belum punya akun?
        <router-link to="/register" class="font-semibold text-primary">Daftar mahasiswa</router-link>
      </p>
    </section>
  </main>
  <Footer />
</template>
