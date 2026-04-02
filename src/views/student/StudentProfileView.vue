<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import DashboardShell from '../../components/dashboard/DashboardShell.vue'
import { apiRequest, resolveApiAssetUrl } from '../../lib/api'
import { useAuthStore } from '../../stores/auth'
import type { StudentProfile } from '../../types/auth'
import { Icon } from '@iconify/vue'

const dashboardMenu = [
  { label: 'Dashboard', to: '/dashboard-mahasiswa', icon: 'heroicons:home-20-solid' },
  { label: 'Profil Saya', to: '/dashboard-mahasiswa/profil', icon: 'heroicons:user-circle-20-solid' },
  { label: 'Edit Profil', to: '/dashboard-mahasiswa/profil/edit', icon: 'heroicons:pencil-square-20-solid' },
  { label: 'Beranda Website', to: '/', icon: 'heroicons:globe-alt-20-solid' },
]

const auth = useAuthStore()
const loading = ref(true)
const profile = ref<StudentProfile>({
  id: 0, fullName: '', email: '', nim: '', phone: '', address: '',
  birthPlace: '', birthDate: '', jurusan: '', prodi: '',
  fotoProfil: '', hobi: '', pesanKesan: '', sertifikatUrl: '', ktmUrl: '',
})

const profileCompletion = computed(() => {
  const fields = [
    profile.value.fullName, profile.value.nim, profile.value.phone,
    profile.value.address, profile.value.birthPlace, profile.value.birthDate,
    profile.value.prodi, profile.value.hobi, profile.value.fotoProfil,
  ]
  const filled = fields.filter(f => f && String(f).trim().length > 0).length
  return Math.round((filled / fields.length) * 100)
})

const docCompletion = computed(() => {
  const fields = [profile.value.sertifikatUrl, profile.value.ktmUrl]
  const filled = fields.filter(f => f && String(f).trim().length > 0).length
  return Math.round((filled / fields.length) * 100)
})

const resolveUrl = (path: string | null) => resolveApiAssetUrl(path)

const loadProfile = async () => {
  loading.value = true
  try {
    const data = await apiRequest<any>('/api/student/profile', { token: auth.state.token })
    profile.value = {
      id: data.id, fullName: data.fullName || '', email: data.email || '',
      nim: data.nim || '', phone: data.phone || '', address: data.address || '',
      birthPlace: data.birthPlace || '', birthDate: data.birthDate || '',
      jurusan: data.jurusan || '', prodi: data.prodi || '',
      fotoProfil: data.fotoProfil || '', hobi: data.hobi || '',
      pesanKesan: data.pesanKesan || '', sertifikatUrl: data.sertifikatUrl || '',
      ktmUrl: data.ktmUrl || '',
    }
  } catch { /* silent */ }
  finally { loading.value = false }
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(loadProfile)
</script>

<template>
  <DashboardShell title="Profil Saya" subtitle="Lihat data profil dan kelengkapan berkas kamu" :menu="dashboardMenu">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>

    <div v-else class="space-y-6">
      <!-- Profile Hero Card -->
      <section class="profile-hero relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-violet-500/10" />
        <div class="relative px-6 pb-6 pt-16">
          <div class="flex flex-col items-center gap-5 sm:flex-row sm:items-end">
            <div class="relative -mt-8 flex-shrink-0">
              <img
                v-if="profile.fotoProfil"
                :src="resolveUrl(profile.fotoProfil) || ''"
                class="h-[200px] w-[200px] lg:h-40 lg:w-40 rounded-full border-2 border-white object-cover shadow-lg"
              />
              <div
                v-else
                class="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-primary to-violet-500 text-3xl font-extrabold text-white shadow-lg"
              >
                {{ (profile.fullName || 'U').charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="flex-1 text-center sm:text-left">
              <h2 class="text-3xl lg:text-4xl font-extrabold text-slate-900">{{ profile.fullName || 'Mahasiswa Baru' }}</h2>
              <p class="text-md lg:text-lg text-slate-800 mb-3">{{ profile.email }}</p>
              <div class="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span v-if="profile.nim" class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Icon icon="heroicons:identification-20-solid" class="text-sm" />
                  NIM: {{ profile.nim }}
                </span>
                <span v-if="profile.prodi" class="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                  <Icon icon="heroicons:academic-cap-20-solid" class="text-sm" />
                  {{ profile.prodi }}
                </span>
                <span v-if="profile.jurusan" class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  <Icon icon="heroicons:building-library-20-solid" class="text-sm" />
                  {{ profile.jurusan }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex flex-col items-center gap-1">
                <div class="relative h-14 w-14">
                  <svg viewBox="0 0 36 36" class="h-full w-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" stroke-width="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" :stroke-dasharray="`${profileCompletion}, 100`" class="text-primary transition-all duration-700" />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-xs font-extrabold text-slate-900">{{ profileCompletion }}%</span>
                  </div>
                </div>
                <span class="text-[10px] font-medium text-slate-400">Profil</span>
              </div>
              <div class="flex flex-col items-center gap-1">
                <div class="relative h-14 w-14">
                  <svg viewBox="0 0 36 36" class="h-full w-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" stroke-width="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" :stroke-dasharray="`${docCompletion}, 100`" class="text-emerald-500 transition-all duration-700" />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-xs font-extrabold text-slate-900">{{ docCompletion }}%</span>
                  </div>
                </div>
                <span class="text-[10px] font-medium text-slate-400">Berkas</span>
              </div>
            </div>
          </div>
          <div class="mt-5 flex justify-center sm:justify-start">
            <router-link
              to="/dashboard-mahasiswa/profil/edit"
              class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
            >
              <Icon icon="heroicons:pencil-square-20-solid" class="text-base" />
              Edit Profil
            </router-link>
          </div>
        </div>
      </section>

      <!-- Info Grid -->
      <div class="grid gap-5 sm:grid-cols-2">
        <!-- Biodata Card -->
        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-5 flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon icon="heroicons:user-20-solid" class="text-xl" />
            </div>
            <h3 class="text-base font-bold text-slate-900">Biodata Pribadi</h3>
          </div>
          <div class="space-y-4">
            <div class="info-row">
              <span class="info-label">Nama Lengkap</span>
              <span class="info-value">{{ profile.fullName || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">{{ profile.email || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">NIM</span>
              <span class="info-value">{{ profile.nim || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Nomor HP</span>
              <span class="info-value">{{ profile.phone || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tempat Lahir</span>
              <span class="info-value">{{ profile.birthPlace || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tanggal Lahir</span>
              <span class="info-value">{{ formatDate(profile.birthDate) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Alamat</span>
              <span class="info-value">{{ profile.address || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Hobi</span>
              <span class="info-value">{{ profile.hobi || '-' }}</span>
            </div>
          </div>
        </section>

        <!-- Akademik & Berkas Card -->
        <div class="space-y-5">
          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                <Icon icon="heroicons:academic-cap-20-solid" class="text-xl" />
              </div>
              <h3 class="text-base font-bold text-slate-900">Informasi Akademik</h3>
            </div>
            <div class="space-y-4">
              <div class="info-row">
                <span class="info-label">Jurusan</span>
                <span class="info-value">{{ profile.jurusan || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Program Studi</span>
                <span class="info-value">{{ profile.prodi || '-' }}</span>
              </div>
            </div>
          </section>

          <!-- Berkas Card -->
          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Icon icon="heroicons:document-arrow-up-20-solid" class="text-xl" />
              </div>
              <h3 class="text-base font-bold text-slate-900">Kelengkapan Berkas</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between rounded-xl border p-3" :class="profile.sertifikatUrl ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'">
                <div class="flex items-center gap-2 text-sm font-medium" :class="profile.sertifikatUrl ? 'text-emerald-700' : 'text-amber-700'">
                  <Icon :icon="profile.sertifikatUrl ? 'heroicons:check-circle-20-solid' : 'heroicons:exclamation-triangle-20-solid'" class="text-base" />
                  Sertifikat Prestasi
                </div>
                <a v-if="profile.sertifikatUrl" :href="resolveUrl(profile.sertifikatUrl) || '#'" target="_blank" class="text-xs font-semibold text-primary hover:underline">Lihat →</a>
                <span v-else class="text-xs font-medium text-amber-600">Belum diupload</span>
              </div>
              <div class="flex items-center justify-between rounded-xl border p-3" :class="profile.ktmUrl ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'">
                <div class="flex items-center gap-2 text-sm font-medium" :class="profile.ktmUrl ? 'text-emerald-700' : 'text-amber-700'">
                  <Icon :icon="profile.ktmUrl ? 'heroicons:check-circle-20-solid' : 'heroicons:exclamation-triangle-20-solid'" class="text-base" />
                  Kartu Tanda Mahasiswa
                </div>
                <a v-if="profile.ktmUrl" :href="resolveUrl(profile.ktmUrl) || '#'" target="_blank" class="text-xs font-semibold text-primary hover:underline">Lihat →</a>
                <span v-else class="text-xs font-medium text-amber-600">Belum diupload</span>
              </div>
            </div>
          </section>

          <!-- Pesan & Kesan -->
          <section v-if="profile.pesanKesan" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-4 flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Icon icon="heroicons:chat-bubble-bottom-center-text-20-solid" class="text-xl" />
              </div>
              <h3 class="text-base font-bold text-slate-900">Pesan & Kesan</h3>
            </div>
            <p class="text-sm leading-relaxed text-slate-600">{{ profile.pesanKesan }}</p>
          </section>
        </div>
      </div>
    </div>
  </DashboardShell>
</template>

<style scoped>
.info-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}
.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.info-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}
</style>
