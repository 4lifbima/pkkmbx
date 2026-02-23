<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
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

interface StudentDetail {
  id: number
  fullName: string
  email: string
  createdAt: string
  profile: {
    nim: string | null; phone: string | null; address: string | null
    birthPlace: string | null; birthDate: string | null
    jurusan: string | null; prodi: string | null
    fotoProfil: string | null; hobi: string | null; pesanKesan: string | null
  }
  documents: { sertifikatUrl: string | null; ktmUrl: string | null }
}

const auth = useAuthStore()
const route = useRoute()
const studentId = Number(route.params.id)
const loading = ref(true)
const student = ref<StudentDetail | null>(null)
const errorMessage = ref('')

const resolveFileUrl = (relativePath: string | null) => {
  if (!relativePath) return null
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) return relativePath
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? `${window.location.protocol}//${window.location.hostname}:8000`
  return `${apiBase}${relativePath}`
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return dateStr }
}

const loadStudent = async () => {
  loading.value = true
  try {
    student.value = await apiRequest<StudentDetail>(`/api/admin/students/${studentId}`, { token: auth.state.token })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal memuat data.'
  } finally {
    loading.value = false
  }
}

onMounted(loadStudent)
</script>

<template>
  <DashboardShell title="Detail Mahasiswa" subtitle="Informasi lengkap mahasiswa" :menu="dashboardMenu">
    <div class="mx-auto max-w-3xl">
      <router-link
        to="/dashboard-admin/mahasiswa"
        class="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-primary"
      >
        <Icon icon="heroicons:arrow-left-20-solid" class="text-base" />
        Kembali ke daftar
      </router-link>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>

      <p v-else-if="errorMessage" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
        {{ errorMessage }}
      </p>

      <div v-else-if="student" class="space-y-6">
        <!-- Profile Header Card -->
        <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div class="h-20 bg" />
          <div class="relative px-6 pb-6">
            <div class="-mt-14 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
              <img
                v-if="student.profile.fotoProfil"
                :src="resolveFileUrl(student.profile.fotoProfil) || ''"
                class="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg"
              />
              <div
                v-else
                class="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-primary/15 text-4xl font-extrabold text-primary shadow-lg"
              >
                {{ student.fullName.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 pb-1 text-center sm:text-left">
                <h2 class="text-2xl font-extrabold text-slate-900">{{ student.fullName }}</h2>
                <p class="text-sm text-slate-500">{{ student.email }}</p>
                <div class="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <span v-if="student.profile.nim" class="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    NIM: {{ student.profile.nim }}
                  </span>
                  <span v-if="student.profile.prodi" class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {{ student.profile.prodi }}
                  </span>
                  <span v-if="student.profile.jurusan" class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {{ student.profile.jurusan }}
                  </span>
                </div>
              </div>
              <router-link
                :to="`/dashboard-admin/mahasiswa/${student.id}/edit`"
                class="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                <Icon icon="heroicons:pencil-square-20-solid" class="text-base" />
                Edit
              </router-link>
            </div>
          </div>
        </article>

        <!-- Biodata Grid -->
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="mb-5 flex items-center gap-2 text-base font-bold text-slate-900">
            <Icon icon="heroicons:user-20-solid" class="text-lg text-primary" />
            Biodata Pribadi
          </h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Nama Lengkap</p>
              <p class="mt-1 text-sm font-medium text-slate-800">{{ student.fullName }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</p>
              <p class="mt-1 text-sm font-medium text-slate-800">{{ student.email }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">NIM</p>
              <p class="mt-1 text-sm font-medium text-slate-800">{{ student.profile.nim || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Nomor HP</p>
              <p class="mt-1 text-sm font-medium text-slate-800">{{ student.profile.phone || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Jurusan</p>
              <p class="mt-1 text-sm font-medium text-slate-800">{{ student.profile.jurusan || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Program Studi</p>
              <p class="mt-1 text-sm font-medium text-slate-800">{{ student.profile.prodi || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Tempat Lahir</p>
              <p class="mt-1 text-sm font-medium text-slate-800">{{ student.profile.birthPlace || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Tanggal Lahir</p>
              <p class="mt-1 text-sm font-medium text-slate-800">{{ formatDate(student.profile.birthDate) }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Hobi</p>
              <p class="mt-1 text-sm font-medium text-slate-800">{{ student.profile.hobi || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Terdaftar Sejak</p>
              <p class="mt-1 text-sm font-medium text-slate-800">{{ formatDate(student.createdAt) }}</p>
            </div>
            <div class="sm:col-span-2">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Alamat</p>
              <p class="mt-1 text-sm font-medium text-slate-800">{{ student.profile.address || '-' }}</p>
            </div>
            <div class="sm:col-span-2">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Pesan & Kesan</p>
              <p class="mt-1 text-sm font-medium text-slate-800 whitespace-pre-line">{{ student.profile.pesanKesan || '-' }}</p>
            </div>
          </div>
        </article>

        <!-- Documents Card -->
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="mb-5 flex items-center gap-2 text-base font-bold text-slate-900">
            <Icon icon="heroicons:document-arrow-up-20-solid" class="text-lg text-primary" />
            Berkas Mahasiswa
          </h3>
          <div class="grid gap-5 sm:grid-cols-2">
            <!-- Foto Profil -->
            <div class="rounded-xl border border-slate-200 p-4">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Foto Profil</p>
              <div v-if="student.profile.fotoProfil" class="flex justify-center">
                <a :href="resolveFileUrl(student.profile.fotoProfil) || '#'" target="_blank">
                  <img
                    :src="resolveFileUrl(student.profile.fotoProfil) || ''"
                    class="max-h-48 rounded-xl object-contain shadow-sm transition hover:shadow-md"
                  />
                </a>
              </div>
              <p v-else class="py-8 text-center text-sm text-slate-400">Belum diupload</p>
            </div>

            <!-- Sertifikat -->
            <div class="rounded-xl border border-slate-200 p-4">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Sertifikat Prestasi</p>
              <div v-if="student.documents.sertifikatUrl">
                <a
                  :href="resolveFileUrl(student.documents.sertifikatUrl) || '#'"
                  target="_blank"
                  class="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 transition hover:bg-emerald-100"
                >
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600">
                    <Icon icon="heroicons:document-check-20-solid" class="text-xl" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-emerald-800">File Terupload</p>
                    <p class="text-xs text-emerald-600">Klik untuk melihat →</p>
                  </div>
                </a>
              </div>
              <p v-else class="py-8 text-center text-sm text-slate-400">Belum diupload</p>
            </div>

            <!-- KTM -->
            <div class="rounded-xl border border-slate-200 p-4 sm:col-span-2">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Kartu Tanda Mahasiswa (KTM)</p>
              <div v-if="student.documents.ktmUrl">
                <a
                  :href="resolveFileUrl(student.documents.ktmUrl) || '#'"
                  target="_blank"
                  class="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4 transition hover:bg-violet-100"
                >
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20 text-violet-600">
                    <Icon icon="heroicons:identification-20-solid" class="text-xl" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-violet-800">File Terupload</p>
                    <p class="text-xs text-violet-600">Klik untuk melihat →</p>
                  </div>
                </a>
              </div>
              <p v-else class="py-8 text-center text-sm text-slate-400">Belum diupload</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </DashboardShell>
</template>
