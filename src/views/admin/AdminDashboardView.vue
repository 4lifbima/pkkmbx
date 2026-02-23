<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DashboardShell from '../../components/dashboard/DashboardShell.vue'
import { apiRequest } from '../../lib/api'
import { useAuthStore } from '../../stores/auth'
import { Icon } from '@iconify/vue'

const dashboardMenu = [
  { label: 'Dashboard', to: '/dashboard-admin', icon: 'heroicons:home-modern-20-solid' },
  { label: 'Master Mahasiswa', to: '/dashboard-admin/mahasiswa', icon: 'heroicons:academic-cap-20-solid' },
  { label: 'Master Jurusan', to: '/dashboard-admin/jurusan', icon: 'heroicons:building-library-20-solid' },
  { label: 'Beranda Website', to: '/', icon: 'heroicons:globe-alt-20-solid' },
]

const auth = useAuthStore()
const loading = ref(true)

const stats = ref({
  totalStudents: 0,
  completedProfiles: 0,
  uploadedDocs: 0,
  monthlyRegistrations: [] as { month: string; count: number }[],
  studentsPerProdi: [] as { prodi: string; count: number }[],
})

const loadStats = async () => {
  loading.value = true
  try {
    stats.value = await apiRequest('/api/admin/stats', { token: auth.state.token })
  } catch { /* silent */ } finally {
    loading.value = false
  }
}

const incompleteProfiles = () => stats.value.totalStudents - stats.value.completedProfiles
const completionPercent = () =>
  stats.value.totalStudents === 0 ? 0 : Math.round((stats.value.completedProfiles / stats.value.totalStudents) * 100)

const maxProdiCount = () => {
  const counts = stats.value.studentsPerProdi.map((p) => p.count)
  return counts.length ? Math.max(...counts) : 1
}

onMounted(loadStats)
</script>

<template>
  <DashboardShell title="Dashboard Admin" subtitle="Ringkasan data dan statistik PKKMB" :menu="dashboardMenu">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>

    <div v-else class="space-y-6">
      <!-- Stat Cards -->
      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/10 transition group-hover:scale-125" />
          <div class="relative">
            <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Icon icon="heroicons:users-20-solid" class="text-xl" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Mahasiswa</p>
            <h2 class="mt-1 text-3xl font-extrabold text-slate-900">{{ stats.totalStudents }}</h2>
          </div>
        </article>

        <article
          class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-500/10 transition group-hover:scale-125" />
          <div class="relative">
            <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
              <Icon icon="heroicons:check-badge-20-solid" class="text-xl" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Profil Lengkap</p>
            <h2 class="mt-1 text-3xl font-extrabold text-slate-900">{{ stats.completedProfiles }}</h2>
          </div>
        </article>

        <article
          class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-500/10 transition group-hover:scale-125" />
          <div class="relative">
            <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
              <Icon icon="heroicons:exclamation-circle-20-solid" class="text-xl" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Profil Belum Lengkap</p>
            <h2 class="mt-1 text-3xl font-extrabold text-slate-900">{{ incompleteProfiles() }}</h2>
          </div>
        </article>

        <article
          class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-violet-500/10 transition group-hover:scale-125" />
          <div class="relative">
            <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600">
              <Icon icon="heroicons:document-arrow-up-20-solid" class="text-xl" />
            </div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Upload Berkas</p>
            <h2 class="mt-1 text-3xl font-extrabold text-slate-900">{{ stats.uploadedDocs }}</h2>
          </div>
        </article>
      </section>

      <!-- Charts row -->
      <section class="grid gap-6 xl:grid-cols-2">
        <!-- Completion Progress -->
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-base font-bold text-slate-900">Kelengkapan Profil</h3>
          <p class="mt-1 text-xs text-slate-500">Persentase mahasiswa yang sudah melengkapi profil</p>
          <div class="mt-6 flex items-center gap-6">
            <div class="relative h-32 w-32 flex-shrink-0">
              <svg viewBox="0 0 36 36" class="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" stroke-width="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  :stroke-dasharray="`${completionPercent()}, 100`"
                  class="text-primary transition-all duration-700"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-2xl font-extrabold text-slate-900">{{ completionPercent() }}%</span>
              </div>
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex items-center gap-2">
                <span class="h-3 w-3 rounded-full bg-primary" />
                <span class="text-slate-600">Lengkap: <strong>{{ stats.completedProfiles }}</strong></span>
              </div>
              <div class="flex items-center gap-2">
                <span class="h-3 w-3 rounded-full bg-slate-200" />
                <span class="text-slate-600">Belum: <strong>{{ incompleteProfiles() }}</strong></span>
              </div>
            </div>
          </div>
        </article>

        <!-- Students per Prodi bar chart -->
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-base font-bold text-slate-900">Mahasiswa per Program Studi</h3>
          <p class="mt-1 text-xs text-slate-500">Distribusi mahasiswa berdasarkan prodi</p>
          <div v-if="stats.studentsPerProdi.length === 0" class="mt-8 text-center text-sm text-slate-400">
            Belum ada data prodi
          </div>
          <div v-else class="mt-6 space-y-3">
            <div v-for="item in stats.studentsPerProdi" :key="item.prodi" class="flex items-center gap-3">
              <span class="w-28 truncate text-xs font-medium text-slate-600" :title="item.prodi">{{ item.prodi }}</span>
              <div class="relative h-7 flex-1 overflow-hidden rounded-lg bg-slate-100">
                <div
                  class="absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r from-primary to-primary/70 transition-all duration-700"
                  :style="{ width: `${(item.count / maxProdiCount()) * 100}%` }"
                />
                <span class="relative z-10 flex h-full items-center pl-2 text-xs font-bold text-white drop-shadow">
                  {{ item.count }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <!-- Monthly Registrations -->
      <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-base font-bold text-slate-900">Registrasi Bulanan</h3>
        <p class="mt-1 text-xs text-slate-500">Jumlah pendaftaran mahasiswa 6 bulan terakhir</p>
        <div v-if="stats.monthlyRegistrations.length === 0" class="mt-8 text-center text-sm text-slate-400">
          Belum ada data registrasi
        </div>
        <div v-else class="mt-6 flex items-end gap-3 overflow-x-auto pb-2" style="min-height: 160px">
          <div
            v-for="item in stats.monthlyRegistrations"
            :key="item.month"
            class="flex flex-1 flex-col items-center gap-2"
            style="min-width: 56px"
          >
            <span class="text-xs font-bold text-slate-700">{{ item.count }}</span>
            <div
              class="w-10 rounded-t-lg bg-gradient-to-t from-primary to-primary/60 transition-all duration-700"
              :style="{ height: `${Math.max(24, item.count * 24)}px` }"
            />
            <span class="text-[10px] font-medium text-slate-500">{{ item.month.slice(5) }}</span>
          </div>
        </div>
      </section>
    </div>
  </DashboardShell>
</template>
