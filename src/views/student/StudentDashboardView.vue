<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
import DashboardShell from '../../components/dashboard/DashboardShell.vue'
import { apiRequest, resolveApiAssetUrl } from '../../lib/api'
import { useAuthStore } from '../../stores/auth'
import { Icon } from '@iconify/vue'

const dashboardMenu = [
  { label: 'Dashboard', to: '/dashboard-mahasiswa', icon: 'heroicons:home-20-solid' },
  { label: 'Profil Saya', to: '/dashboard-mahasiswa/profil', icon: 'heroicons:user-circle-20-solid' },
  { label: 'Edit Profil', to: '/dashboard-mahasiswa/profil/edit', icon: 'heroicons:pencil-square-20-solid' },
  { label: 'Beranda Website', to: '/', icon: 'heroicons:globe-alt-20-solid' },
]

const auth = useAuthStore()
const loading = ref(true)
const showAlert = ref(true)

interface DashboardData {
  profile: {
    id: number
    fullName: string
    email: string
    nim: string | null
    phone: string | null
    prodi: string | null
    jurusan: string | null
    fotoProfil: string | null
    createdAt: string | null
  }
  completion: {
    profile: number
    documents: number
    overall: number
  }
  missingFields: string[]
  stats: {
    totalStudents: number
    completedProfiles: number
    uploadedDocs: number
  }
  charts: {
    studentsPerProdi: { prodi: string; count: number }[]
    monthlyRegistrations: { month: string; count: number }[]
  }
  recentStudents: {
    id: number
    fullName: string
    email: string
    createdAt: string
    fotoProfil: string | null
    prodi: string | null
  }[]
}

const dashboard = ref<DashboardData | null>(null)

const resolveUrl = (path: string | null) => resolveApiAssetUrl(path)

const greetingMessage = computed(() => {
  const hr = new Date().getHours()
  if (hr < 12) return 'Selamat Pagi'
  if (hr < 15) return 'Selamat Siang'
  if (hr < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})

const greetingIcon = computed(() => {
  const hr = new Date().getHours()
  if (hr < 6) return '🌙'
  if (hr < 12) return '☀️'
  if (hr < 15) return '🌤️'
  if (hr < 18) return '🌅'
  return '🌙'
})

const memberSince = computed(() => {
  if (!dashboard.value?.profile.createdAt) return ''
  const d = new Date(dashboard.value.profile.createdAt)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
})

const completionColor = (val: number) => {
  if (val >= 80) return 'text-emerald-500'
  if (val >= 50) return 'text-amber-500'
  return 'text-red-500'
}

const completionBg = (val: number) => {
  if (val >= 80) return 'bg-emerald-500'
  if (val >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

// Chart rendering (pure canvas, no library)
const chartBarCanvas = ref<HTMLCanvasElement | null>(null)
const chartDonutCanvas = ref<HTMLCanvasElement | null>(null)

const drawBarChart = () => {
  const canvas = chartBarCanvas.value
  if (!canvas || !dashboard.value) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, rect.width, rect.height)

  const data = dashboard.value.charts.monthlyRegistrations
  if (data.length === 0) {
    ctx.fillStyle = '#94a3b8'
    ctx.font = '13px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Belum ada data registrasi', rect.width / 2, rect.height / 2)
    return
  }

  const maxVal = Math.max(...data.map(d => d.count), 1)
  const padding = { top: 20, right: 20, bottom: 40, left: 45 }
  const chartW = rect.width - padding.left - padding.right
  const chartH = rect.height - padding.top - padding.bottom
  const barW = Math.min(chartW / data.length * 0.6, 40)
  const gap = chartW / data.length

  // Grid lines
  const gridLines = 4
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (chartH / gridLines) * i
    ctx.strokeStyle = '#f1f5f9'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(rect.width - padding.right, y)
    ctx.stroke()

    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(String(Math.round(maxVal - (maxVal / gridLines) * i)), padding.left - 8, y + 4)
  }

  // Bars
  data.forEach((item, i) => {
    const barH = (item.count / maxVal) * chartH
    const x = padding.left + gap * i + (gap - barW) / 2
    const y = padding.top + chartH - barH

    // Bar gradient
    const grad = ctx.createLinearGradient(x, y, x, y + barH)
    grad.addColorStop(0, '#7B5AE6')
    grad.addColorStop(1, '#a78bfa')
    ctx.fillStyle = grad

    // Rounded top
    const radius = Math.min(6, barW / 2)
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + barW - radius, y)
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius)
    ctx.lineTo(x + barW, y + barH)
    ctx.lineTo(x, y + barH)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.fill()

    // Value on top
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(String(item.count), x + barW / 2, y - 6)

    // Label
    ctx.fillStyle = '#64748b'
    ctx.font = '10px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'
    const parts = item.month.split('-')
    const label = (parts[1] ?? '') + '/' + (parts[0] ?? '').slice(2)
    ctx.fillText(label, x + barW / 2, padding.top + chartH + 18)
  })
}

const drawDonutChart = () => {
  const canvas = chartDonutCanvas.value
  if (!canvas || !dashboard.value) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, rect.width, rect.height)

  const data = dashboard.value.charts.studentsPerProdi
  if (data.length === 0) {
    ctx.fillStyle = '#94a3b8'
    ctx.font = '13px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Belum ada data', rect.width / 2, rect.height / 2)
    return
  }

  const total = data.reduce((s, d) => s + d.count, 0)
  const colors = ['#7B5AE6', '#f59e0b', '#10b981', '#f43f5e', '#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#6366f1']
  const cx = rect.width * 0.38
  const cy = rect.height / 2
  const outerR = Math.min(cx, cy) - 10
  const innerR = outerR * 0.55
  let startAngle = -Math.PI / 2

  data.forEach((item, i) => {
    const sliceAngle = (item.count / total) * Math.PI * 2
    const color = colors[i % colors.length]

    ctx.beginPath()
    ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle)
    ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true)
    ctx.closePath()
    ctx.fillStyle = color ?? '#7B5AE6'
    ctx.fill()

    startAngle += sliceAngle
  })

  // Center text
  ctx.fillStyle = '#1e293b'
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(String(total), cx, cy + 2)
  ctx.fillStyle = '#94a3b8'
  ctx.font = '10px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('Total', cx, cy + 16)

  // Legend
  const legendX = rect.width * 0.7
  const legendStartY = Math.max(20, cy - (data.length * 22) / 2)
  data.forEach((item, i) => {
    const ly = legendStartY + i * 22
    const color = colors[i % colors.length]

    ctx.fillStyle = color ?? '#7B5AE6'
    ctx.beginPath()
    ctx.arc(legendX, ly + 5, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#475569'
    ctx.font = '11px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'left'
    const displayName = item.prodi.length > 15 ? item.prodi.slice(0, 15) + '…' : item.prodi
    ctx.fillText(`${displayName} (${item.count})`, legendX + 12, ly + 9)
  })
}

let resizeHandler: (() => void) | null = null

const loadDashboard = async () => {
  loading.value = true
  try {
    dashboard.value = await apiRequest<DashboardData>('/api/student/dashboard', { token: auth.state.token })
    await nextTick()
    drawBarChart()
    drawDonutChart()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadDashboard()
  resizeHandler = () => {
    drawBarChart()
    drawDonutChart()
  }
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})

const statCards = computed(() => {
  if (!dashboard.value) return []
  const d = dashboard.value
  return [
    {
      label: 'Kelengkapan Profil',
      value: `${d.completion.profile}%`,
      icon: 'heroicons:user-circle-20-solid',
      color: 'from-violet-500 to-purple-600',
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-600',
      subtitle: d.completion.profile >= 100 ? 'Profil lengkap ✓' : 'Perlu dilengkapi',
    },
    {
      label: 'Kelengkapan Berkas',
      value: `${d.completion.documents}%`,
      icon: 'heroicons:document-check-20-solid',
      color: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-600',
      subtitle: d.completion.documents >= 100 ? 'Berkas lengkap ✓' : 'Upload berkas',
    },
    {
      label: 'Total Mahasiswa',
      value: d.stats.totalStudents,
      icon: 'heroicons:users-20-solid',
      color: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-600',
      subtitle: 'Terdaftar PKKMB',
    },
    {
      label: 'Profil Selesai',
      value: d.stats.completedProfiles,
      icon: 'heroicons:check-badge-20-solid',
      color: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-600',
      subtitle: `${d.stats.totalStudents > 0 ? Math.round((d.stats.completedProfiles / d.stats.totalStudents) * 100) : 0}% dari total`,
    },
  ]
})
</script>

<template>
  <DashboardShell title="Dashboard" subtitle="Selamat datang di portal mahasiswa PKKMB" :menu="dashboardMenu">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-24">
      <div class="flex flex-col items-center gap-4">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p class="animate-pulse text-sm font-medium text-slate-500">Memuat dashboard...</p>
      </div>
    </div>

    <div v-else-if="dashboard" class="space-y-6">
      <!-- Greeting Banner -->
      <section class="greeting-banner relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
        <div class="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-primary/10 to-violet-500/10 blur-2xl" />
        <div class="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/10 to-primary/5 blur-xl" />
        <div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-4">
            <div class="relative flex-shrink-0">
              <img
                v-if="dashboard.profile.fotoProfil"
                :src="resolveUrl(dashboard.profile.fotoProfil) || ''"
                class="h-16 w-16 rounded-2xl border-2 border-white object-cover shadow-lg ring-2 ring-primary/20"
              />
              <div
                v-else
                class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 text-xl font-extrabold text-white shadow-lg ring-2 ring-primary/20"
              >
                {{ (dashboard.profile.fullName || 'U').charAt(0).toUpperCase() }}
              </div>
              <div class="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white ring-2 ring-white">
                <Icon icon="heroicons:check-20-solid" />
              </div>
            </div>
            <div>
              <p class="mb-0.5 text-sm text-slate-500">
                {{ greetingIcon }} {{ greetingMessage }},
              </p>
              <h2 class="text-xl font-extrabold text-slate-900 sm:text-2xl">
                {{ dashboard.profile.fullName || 'Mahasiswa Baru' }}
              </h2>
              <div class="mt-1 flex flex-wrap items-center gap-2">
                <span v-if="dashboard.profile.prodi" class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <Icon icon="heroicons:academic-cap-20-solid" class="text-[10px]" />
                  {{ dashboard.profile.prodi }}
                </span>
                <span v-if="memberSince" class="text-xs text-slate-400">
                  Sejak {{ memberSince }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3 sm:flex-col sm:items-end">
            <router-link
              to="/dashboard-mahasiswa/profil/edit"
              class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:shadow-md hover:shadow-primary/30"
            >
              <Icon icon="heroicons:pencil-square-20-solid" class="text-base" />
              Lengkapi Profil
            </router-link>
          </div>
        </div>
      </section>

      <!-- Profile Incomplete Alert -->
      <Transition name="fade-slide">
        <section
          v-if="dashboard.missingFields.length > 0 && showAlert"
          class="profile-alert relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-sm"
        >
          <div class="absolute -right-4 top-0 h-full w-24 bg-gradient-to-l from-amber-100/50 to-transparent" />
          <div class="relative flex items-start gap-3">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/15">
              <Icon icon="heroicons:exclamation-triangle-20-solid" class="text-xl text-amber-600" />
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-bold text-amber-900">Profil Belum Lengkap</h4>
              <p class="mt-0.5 text-xs text-amber-700/80">
                Data berikut masih kosong:
                <span class="font-semibold">{{ dashboard.missingFields.join(', ') }}</span>
              </p>
              <router-link
                to="/dashboard-mahasiswa/profil/edit"
                class="mt-2 inline-flex items-center gap-1 text-xs font-bold text-amber-700 transition hover:text-amber-900"
              >
                Lengkapi sekarang
                <Icon icon="heroicons:arrow-right-20-solid" class="text-sm" />
              </router-link>
            </div>
            <button
              class="flex-shrink-0 rounded-lg p-1 text-amber-400 transition hover:bg-amber-100 hover:text-amber-600"
              @click="showAlert = false"
            >
              <Icon icon="heroicons:x-mark-20-solid" class="text-lg" />
            </button>
          </div>
        </section>
      </Transition>

      <!-- Stats Cards -->
      <section class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        <article
          v-for="(card, idx) in statCards"
          :key="idx"
          class="stat-card group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-5"
        >
          <div class="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-10 transition-opacity duration-300 group-hover:opacity-20" :class="card.color" />
          <div class="relative">
            <div class="mb-3 flex items-center justify-between">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl" :class="card.iconBg">
                <Icon :icon="card.icon" class="text-xl" :class="card.iconColor" />
              </div>
            </div>
            <div class="text-2xl font-extrabold text-slate-900 sm:text-3xl">{{ card.value }}</div>
            <p class="mt-0.5 text-xs font-semibold text-slate-500">{{ card.label }}</p>
            <p class="mt-1 text-[10px] text-slate-400">{{ card.subtitle }}</p>
          </div>
        </article>
      </section>

      <!-- Progress Overview -->
      <section class="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm sm:p-6">
        <h3 class="mb-5 flex items-center gap-2 text-base font-bold text-slate-900">
          <Icon icon="heroicons:chart-bar-20-solid" class="text-lg text-primary" />
          Progress Kelengkapan
        </h3>
        <div class="grid gap-5 sm:grid-cols-3">
          <!-- Overall -->
          <div class="flex flex-col items-center gap-3 rounded-xl bg-slate-50 p-4">
            <div class="relative h-20 w-20">
              <svg viewBox="0 0 36 36" class="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" stroke-width="3.5" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" stroke-width="3.5"
                  stroke-linecap="round"
                  :stroke-dasharray="`${dashboard.completion.overall}, 100`"
                  :class="completionColor(dashboard.completion.overall)"
                  class="transition-all duration-1000"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-lg font-extrabold text-slate-900">{{ dashboard.completion.overall }}%</span>
              </div>
            </div>
            <span class="text-xs font-semibold text-slate-500">Keseluruhan</span>
          </div>
          <!-- Profile -->
          <div class="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon icon="heroicons:user-20-solid" class="text-2xl" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-slate-900">Biodata</p>
              <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  class="h-full rounded-full transition-all duration-1000"
                  :class="completionBg(dashboard.completion.profile)"
                  :style="{ width: `${dashboard.completion.profile}%` }"
                />
              </div>
              <p class="mt-1 text-xs text-slate-400">{{ dashboard.completion.profile }}% selesai</p>
            </div>
          </div>
          <!-- Documents -->
          <div class="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Icon icon="heroicons:document-check-20-solid" class="text-2xl" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-slate-900">Berkas</p>
              <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  class="h-full rounded-full transition-all duration-1000"
                  :class="completionBg(dashboard.completion.documents)"
                  :style="{ width: `${dashboard.completion.documents}%` }"
                />
              </div>
              <p class="mt-1 text-xs text-slate-400">{{ dashboard.completion.documents }}% selesai</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Charts Row -->
      <div class="grid gap-5 lg:grid-cols-2">
        <!-- Bar Chart – Monthly Registrations -->
        <section class="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm sm:p-6">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Icon icon="heroicons:chart-bar-square-20-solid" class="text-lg text-primary" />
              Registrasi Bulanan
            </h3>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">6 bulan terakhir</span>
          </div>
          <div class="h-52 w-full sm:h-56">
            <canvas ref="chartBarCanvas" class="h-full w-full" />
          </div>
        </section>

        <!-- Donut Chart – Students per Prodi -->
        <section class="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm sm:p-6">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Icon icon="heroicons:chart-pie-20-solid" class="text-lg text-violet-500" />
              Distribusi per Prodi
            </h3>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">Top 10</span>
          </div>
          <div class="h-52 w-full sm:h-56">
            <canvas ref="chartDonutCanvas" class="h-full w-full" />
          </div>
        </section>
      </div>

      <!-- Quick Actions + Recent Students -->
      <div class="grid gap-5 lg:grid-cols-3">
        <!-- Quick Actions -->
        <section class="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm sm:p-6 lg:col-span-1">
          <h3 class="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Icon icon="heroicons:bolt-20-solid" class="text-lg text-amber-500" />
            Aksi Cepat
          </h3>
          <div class="space-y-2.5">
            <router-link
              to="/dashboard-mahasiswa/profil/edit"
              class="quick-action flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-primary/30 hover:bg-primary/5"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon icon="heroicons:pencil-square-20-solid" class="text-lg" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-800">Edit Profil</p>
                <p class="text-[10px] text-slate-400">Perbarui biodata kamu</p>
              </div>
              <Icon icon="heroicons:chevron-right-20-solid" class="ml-auto text-slate-300" />
            </router-link>
            <router-link
              to="/dashboard-mahasiswa/profil"
              class="quick-action flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-violet-300 hover:bg-violet-50"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                <Icon icon="heroicons:user-circle-20-solid" class="text-lg" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-800">Lihat Profil</p>
                <p class="text-[10px] text-slate-400">Preview data profil</p>
              </div>
              <Icon icon="heroicons:chevron-right-20-solid" class="ml-auto text-slate-300" />
            </router-link>
            <router-link
              to="/"
              class="quick-action flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Icon icon="heroicons:globe-alt-20-solid" class="text-lg" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-800">Website PKKMB</p>
                <p class="text-[10px] text-slate-400">Kunjungi beranda</p>
              </div>
              <Icon icon="heroicons:chevron-right-20-solid" class="ml-auto text-slate-300" />
            </router-link>
          </div>
        </section>

        <!-- Recent Students -->
        <section class="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Icon icon="heroicons:user-group-20-solid" class="text-lg text-blue-500" />
              Mahasiswa Terbaru
            </h3>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">
              {{ dashboard.stats.totalStudents }} total
            </span>
          </div>

          <div v-if="dashboard.recentStudents.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
            <Icon icon="heroicons:users-20-solid" class="mb-2 text-4xl text-slate-300" />
            <p class="text-sm text-slate-400">Belum ada mahasiswa terdaftar</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="(student, idx) in dashboard.recentStudents"
              :key="student.id"
              class="recent-student flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
            >
              <div class="relative flex-shrink-0">
                <img
                  v-if="student.fotoProfil"
                  :src="resolveUrl(student.fotoProfil) || ''"
                  class="h-10 w-10 rounded-xl object-cover"
                />
                <div
                  v-else
                  class="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white"
                  :class="['bg-primary', 'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'][idx % 5]"
                >
                  {{ (student.fullName || 'U').charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-slate-800">{{ student.fullName }}</p>
                <p class="truncate text-[10px] text-slate-400">{{ student.prodi || 'Belum pilih prodi' }}</p>
              </div>
              <span class="hidden flex-shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400 sm:inline-flex">
                {{ new Date(student.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) }}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </DashboardShell>
</template>

<style scoped>
.greeting-banner {
  animation: fadeInUp 0.5s ease-out;
}

.profile-alert {
  animation: slideDown 0.4s ease-out;
}

.stat-card {
  animation: fadeInUp 0.5s ease-out;
}

.stat-card:nth-child(2) { animation-delay: 0.05s; }
.stat-card:nth-child(3) { animation-delay: 0.1s; }
.stat-card:nth-child(4) { animation-delay: 0.15s; }

.quick-action {
  animation: fadeInUp 0.5s ease-out;
}

.recent-student {
  animation: fadeInUp 0.4s ease-out;
}

.recent-student:nth-child(2) { animation-delay: 0.05s; }
.recent-student:nth-child(3) { animation-delay: 0.1s; }
.recent-student:nth-child(4) { animation-delay: 0.15s; }
.recent-student:nth-child(5) { animation-delay: 0.2s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

canvas {
  image-rendering: -webkit-optimize-contrast;
}
</style>
