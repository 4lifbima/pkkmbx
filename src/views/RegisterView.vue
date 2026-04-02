<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

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
  <main class="flex min-h-screen items-center justify-center bg-[#f3f5fb] px-4 py-8">
    <section class="w-full max-w-md rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/50">
      <div class="mb-8 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <img src="/ung.png" alt="Logo" class="h-12 w-12" />
        </div>
        <h1 class="mt-4 text-2xl font-extrabold text-slate-900">Buat Akun Baru 🚀</h1>
        <p class="mt-2 text-sm text-slate-500">Daftarkan diri Anda untuk PKKMB.</p>
      </div>

      <form class="space-y-5" @submit.prevent="submitRegister">
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">Nama Lengkap</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Icon icon="heroicons:user-20-solid" class="text-lg" />
            </div>
            <input
              v-model="fullName"
              type="text"
              required
              placeholder="Masukkan nama lengkap Anda"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Icon icon="heroicons:envelope-20-solid" class="text-lg" />
            </div>
            <input
              v-model="email"
              type="email"
              required
              placeholder="Masukkan alamat email aktif"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Icon icon="heroicons:lock-closed-20-solid" class="text-lg" />
            </div>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              placeholder="Buat sandi yang kuat (min. 6 karakter)"
              class="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        
        <p v-if="errorMessage" class="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
          <Icon icon="heroicons:exclamation-circle-20-solid" class="text-lg" />
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="mt-2 w-full rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/25 transition hover:bg-primary-dark hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ isSubmitting ? 'Memproses...' : 'Daftar Sekarang' }}
        </button>
      </form>

      <div class="mt-8 text-center text-sm text-slate-500">
        Sudah memiliki akun?
        <router-link to="/login" class="font-bold text-primary transition hover:text-primary-dark hover:underline">
          Masuk di sini
        </router-link>
      </div>
    </section>
  </main>
</template>
