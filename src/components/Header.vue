<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const isMenuOpen = ref(false)
const auth = useAuthStore()
const router = useRouter()

const navItems = [
  { name: 'Beranda', to: '/' },
  { name: 'Agenda', to: '/agenda' },
  { name: 'Tentang', to: '/tentang' },
  { name: 'Kontak', to: '/kontak' },
]

const logout = async () => {
  auth.clearAuth()
  isMenuOpen.value = false
  await router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
      <router-link to="/" class="text-base font-bold text-slate-900 md:text-lg flex ">
        <img src="/ung.png" alt="Logo PKKMB IF FT UNG" class="mr-2 inline h-8 w-8 lg:h-12 lg:w-12" />
        <img src="/dikti.png" alt="Logo PKKMB IF FT UNG" class="mr-2 inline h-8 w-8 lg:h-12 lg:w-12" />
        <img src="/pkkmb-icon.png" alt="Logo PKKMB IF FT UNG" class="mr-2 inline h-8 w-8 lg:h-12 lg:w-12" />
        <div class="flex flex-col leading-tight">
          <h3 class="font-extrabold lg:text-md text-primary">PKKMB JTIFUNG 2026</h3>
          <p class="lg:text-sm text-xs">Universitas Negeri Gorontalo</p>
        </div>
      </router-link>

      <button
        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-700 md:hidden"
        @click="isMenuOpen = !isMenuOpen"
        type="button"
        aria-label="Toggle mobile menu"
      >
        <Icon :icon="isMenuOpen ? 'heroicons:x-mark-20-solid' : 'heroicons:bars-3-20-solid'" class="text-xl" />
      </button>

      <nav class="hidden items-center gap-6 md:flex">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="text-sm font-medium text-slate-700 transition hover:text-primary"
        >
          {{ item.name }}
        </router-link>
        <template v-if="auth.state.user">
          <router-link
            :to="auth.state.user.role === 'admin' ? '/dashboard-admin' : '/dashboard-mahasiswa'"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark"
          >
            Dashboard
          </router-link>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-500"
            @click="logout"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <router-link
            to="/login"
            class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark"
          >
            Daftar
          </router-link>
        </template>
      </nav>
    </div>

    <transition name="fade-slide">
      <nav v-if="isMenuOpen" class="border-t border-slate-200 px-4 py-4 md:hidden">
        <div class="mx-auto flex max-w-6xl flex-col gap-3">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.to"
            class="rounded-lg px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
          <template v-if="auth.state.user">
            <router-link
              :to="auth.state.user.role === 'admin' ? '/dashboard-admin' : '/dashboard-mahasiswa'"
              class="mt-2 rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark"
              @click="isMenuOpen = false"
            >
              Dashboard
            </router-link>
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-500"
              @click="logout"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="mt-2 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
              @click="isMenuOpen = false"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark"
              @click="isMenuOpen = false"
            >
              Daftar
            </router-link>
          </template>
        </div>
      </nav>
    </transition>
  </header>
</template>
