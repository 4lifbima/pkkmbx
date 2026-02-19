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

const currentUserLabel = computed(() => auth.state.user?.fullName ?? 'User')

const logout = async () => {
  auth.clearAuth()
  await router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#f3f5fb]">
    <div class="flex">
      <aside
        class="fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white px-5 py-6 shadow-sm transition-transform duration-300 md:translate-x-0"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <Icon icon="heroicons:chart-bar-square-20-solid" class="text-xl" />
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-slate-400">Dashboard</p>
            <h2 class="text-xl font-extrabold text-slate-900">PKKMB JTIF</h2>
          </div>
        </div>

        <p class="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-400">Menu</p>
        <nav class="mt-3 space-y-2">
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

        <button
          type="button"
          class="mt-8 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-500"
          @click="logout"
        >
          Logout
        </button>
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
              <div class="h-10 w-10 rounded-full bg-primary/15" />
            </div>
          </div>
        </header>

        <main class="p-4 md:p-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
