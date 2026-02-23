<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DashboardShell from '../../components/dashboard/DashboardShell.vue'
import { apiRequest } from '../../lib/api'
import { useAuthStore } from '../../stores/auth'
import { Icon } from '@iconify/vue'


interface StudentListItem {
  id: number
  fullName: string
  email: string
  createdAt: string
  profile: {
    nim: string | null
    phone: string | null
    prodi: string | null
    fotoProfil: string | null
  }
  documents: {
    sertifikatUrl: string | null
    ktmUrl: string | null
  }
}

const dashboardMenu = [
  { label: 'Dashboard', to: '/dashboard-admin', icon: 'heroicons:home-modern-20-solid' },
  { label: 'Master Mahasiswa', to: '/dashboard-admin/mahasiswa', icon: 'heroicons:academic-cap-20-solid' },
  { label: 'Master Jurusan', to: '/dashboard-admin/jurusan', icon: 'heroicons:building-library-20-solid' },
  { label: 'Beranda Website', to: '/', icon: 'heroicons:globe-alt-20-solid' },
]

const auth = useAuthStore()
const students = ref<StudentListItem[]>([])
const loading = ref(false)
const message = ref('')
const errorMessage = ref('')
const searchQuery = ref('')
const showDeleteModal = ref(false)
const deleteTarget = ref<StudentListItem | null>(null)
const deleting = ref(false)

const filteredStudents = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return students.value
  return students.value.filter(
    (s) =>
      s.fullName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.profile.nim && s.profile.nim.toLowerCase().includes(q)) ||
      (s.profile.prodi && s.profile.prodi.toLowerCase().includes(q)),
  )
})

const resolveFileUrl = (relativePath: string | null) => {
  if (!relativePath) return undefined
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) return relativePath
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ?? `${window.location.protocol}//${window.location.hostname}:8000`
  return `${apiBase}${relativePath}`
}

const loadStudents = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    students.value = await apiRequest<StudentListItem[]>('/api/admin/students', { token: auth.state.token })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal memuat data mahasiswa.'
  } finally {
    loading.value = false
  }
}

const confirmDelete = (student: StudentListItem) => {
  deleteTarget.value = student
  showDeleteModal.value = true
}

const doDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await apiRequest(`/api/admin/students/${deleteTarget.value.id}`, {
      method: 'DELETE',
      token: auth.state.token,
    })
    message.value = 'Mahasiswa berhasil dihapus.'
    showDeleteModal.value = false
    deleteTarget.value = null
    await loadStudents()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal menghapus mahasiswa.'
  } finally {
    deleting.value = false
  }
}

onMounted(loadStudents)
</script>

<template>
  <DashboardShell title="Master Mahasiswa" subtitle="Kelola data mahasiswa PKKMB" :menu="dashboardMenu">
    <div class="space-y-4">
      <!-- Top bar -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative flex-1 sm:max-w-xs">
          <Icon icon="heroicons:magnifying-glass-20-solid" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama, email, NIM..."
            class="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <router-link
          to="/dashboard-admin/mahasiswa/create"
          class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Icon icon="heroicons:plus-20-solid" class="text-lg" />
          Tambah Mahasiswa
        </router-link>
      </div>

      <!-- Success / Error messages -->
      <p v-if="message" class="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
        {{ message }}
      </p>
      <p v-if="errorMessage" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
        {{ errorMessage }}
      </p>

      <!-- Table -->
      <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div v-if="loading" class="flex items-center justify-center py-16">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <div v-else-if="students.length === 0" class="px-6 py-16 text-center text-sm text-slate-500">
          Belum ada data mahasiswa.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th class="px-4 py-3">Mahasiswa</th>
                <th class="px-4 py-3">NIM</th>
                <th class="px-4 py-3">Prodi</th>
                <th class="px-4 py-3">Berkas</th>
                <th class="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in filteredStudents"
                :key="student.id"
                class="border-b border-slate-100 transition hover:bg-slate-50/50"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <img
                      v-if="student.profile.fotoProfil"
                      :src="resolveFileUrl(student.profile.fotoProfil)"
                      class="h-9 w-9 rounded-full object-cover"
                    />
                    <div v-else class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {{ student.fullName.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-semibold text-slate-800">{{ student.fullName }}</p>
                      <p class="text-xs text-slate-500">{{ student.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-slate-700">{{ student.profile.nim || '-' }}</td>
                <td class="px-4 py-3 text-slate-700">{{ student.profile.prodi || '-' }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-1.5">
                    <span
                      :class="student.documents.sertifikatUrl ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                      class="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    >
                      Sertifikat
                    </span>
                    <span
                      :class="student.documents.ktmUrl ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                      class="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    >
                      KTM
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <router-link
                      :to="`/dashboard-admin/mahasiswa/${student.id}`"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-primary hover:text-primary"
                      title="Detail"
                    >
                      <Icon icon="heroicons:eye-20-solid" class="text-base" />
                    </router-link>
                    <router-link
                      :to="`/dashboard-admin/mahasiswa/${student.id}/edit`"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-primary hover:text-primary"
                      title="Edit"
                    >
                      <Icon icon="heroicons:pencil-square-20-solid" class="text-base" />
                    </router-link>
                    <button
                      class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-300 hover:text-red-500"
                      title="Hapus"
                      @click="confirmDelete(student)"
                    >
                      <Icon icon="heroicons:trash-20-solid" class="text-base" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="fade-slide">
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" @click.self="showDeleteModal = false">
          <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Icon icon="heroicons:exclamation-triangle-20-solid" class="text-2xl text-red-500" />
            </div>
            <h3 class="text-center text-lg font-bold text-slate-900">Hapus Mahasiswa?</h3>
            <p class="mt-2 text-center text-sm text-slate-500">
              Data <strong>{{ deleteTarget?.fullName }}</strong> akan dihapus permanen.
            </p>
            <div class="mt-6 flex gap-3">
              <button
                class="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="showDeleteModal = false"
              >
                Batal
              </button>
              <button
                :disabled="deleting"
                class="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                @click="doDelete"
              >
                {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </DashboardShell>
</template>
