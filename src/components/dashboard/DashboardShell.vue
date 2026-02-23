<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

interface MenuItem {
  label: string
  to: string
  icon: string
}

const props = defineProps<{
  title: string
  subtitle: string
  menu: MenuItem[]
}>()

const auth = useAuthStore()
const router = useRouter()
const isSidebarOpen = ref(false)
const showLogoutModal = ref(false)

const currentUserLabel = computed(() => auth.state.user?.fullName ?? 'User')
const userInitial = computed(() => (auth.state.user?.fullName ?? 'U').charAt(0).toUpperCase())

const openLogout = () => {
  showLogoutModal.value = true
}

const logout = async () => {
  showLogoutModal.value = false
  auth.clearAuth()
  await router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#f3f5fb]">
    <div class="flex">
      <!-- Sidebar backdrop (mobile) -->
      <Transition name="fade-slide">
        <div
          v-if="isSidebarOpen"
          class="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          @click="isSidebarOpen = false"
        />
      </Transition>

      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-sm transition-transform duration-300 md:translate-x-0"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="flex items-center gap-2 border-b border-slate-100 pb-5">
          <div class="flex h-10 w-10 items-left justify-left gap-2">
            <img src="/ung.png" alt="Logo" class="h-10 w-10" />
          </div>
          <div class="flex flex-col justify-center">
            <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">Dashboard</p>
            <h2 class="text-xl font-extrabold text-slate-900">PKKMB JTIF</h2>
          </div>
        </div>

        <p class="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-400">Menu</p>
        <nav class="mt-3 flex-1 space-y-1">
          <router-link
            v-for="item in props.menu"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            active-class="bg-primary/10 text-primary"
            @click="isSidebarOpen = false"
          >
            <Icon :icon="item.icon" class="text-lg" />
            {{ item.label }}
          </router-link>
        </nav>

        <!-- Logout button at bottom -->
        <div class="mt-auto border-t border-slate-100 pt-4">
          <div class="mb-3 flex items-center gap-3 px-1">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {{ userInitial }}
            </div>
            <div class="flex-1 overflow-hidden">
              <p class="truncate text-sm font-semibold text-slate-800">{{ currentUserLabel }}</p>
              <p class="truncate text-xs text-slate-500">{{ auth.state.user?.email }}</p>
            </div>
          </div>
          <button
            type="button"
            class="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
            @click="openLogout"
          >
            <Icon icon="heroicons:arrow-right-on-rectangle-20-solid" class="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      <div class="w-full md:ml-72">
        <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div class="flex items-center justify-between px-4 py-4 md:px-8">
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 md:hidden"
                @click="isSidebarOpen = !isSidebarOpen"
              >
                <Icon icon="heroicons:bars-3-20-solid" class="text-xl" />
              </button>
              <div>
                <h1 class="text-lg font-bold text-slate-900 md:text-2xl">{{ title }}</h1>
                <p class="text-xs text-slate-500 md:text-sm">{{ subtitle }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 md:inline-flex">
                {{ currentUserLabel }}
              </span>
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                {{ userInitial }}
              </div>
            </div>
          </div>
        </header>

        <main class="p-4 md:p-8">
          <slot />
        </main>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <Teleport to="body">
      <Transition name="fade-slide">
        <div
          v-if="showLogoutModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          @click.self="showLogoutModal = false"
        >
          <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <Icon icon="heroicons:arrow-right-on-rectangle-20-solid" class="text-2xl text-amber-600" />
            </div>
            <h3 class="text-center text-lg font-bold text-slate-900">Konfirmasi Logout</h3>
            <p class="mt-2 text-center text-sm text-slate-500">
              Apakah kamu yakin ingin keluar dari akun ini?
            </p>
            <div class="mt-6 flex gap-3">
              <button
                class="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="showLogoutModal = false"
              >
                Batal
              </button>
              <button
                class="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
                @click="logout"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
