<script setup lang="ts">
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const submitRegister = async () => {
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    await auth.registerStudent(fullName.value, email.value, password.value)
    await router.push('/dashboard-mahasiswa')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Pendaftaran gagal.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Header />
  <main class="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
    <section class="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h1 class="text-2xl font-bold text-slate-900">Pendaftaran Mahasiswa</h1>
      <p class="mt-2 text-sm text-slate-600">Buat akun untuk mengelola biodata PKKMB.</p>

      <form class="mt-6 space-y-4" @submit.prevent="submitRegister">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Nama Lengkap</label>
          <input
            v-model="fullName"
            type="text"
            required
            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-primary/20 transition focus:border-primary focus:ring"
          />
        </div>
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
            minlength="6"
            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none ring-primary/20 transition focus:border-primary focus:ring"
          />
        </div>
        <p v-if="errorMessage" class="text-sm font-medium text-red-500">{{ errorMessage }}</p>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ isSubmitting ? 'Memproses...' : 'Daftar Sekarang' }}
        </button>
      </form>

      <p class="mt-4 text-sm text-slate-600">
        Sudah punya akun?
        <router-link to="/login" class="font-semibold text-primary">Login di sini</router-link>
      </p>
    </section>
  </main>
  <Footer />
</template>
