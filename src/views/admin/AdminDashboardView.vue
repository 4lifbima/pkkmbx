<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DashboardShell from '../../components/dashboard/DashboardShell.vue'
import { apiRequest } from '../../lib/api'
import { useAuthStore } from '../../stores/auth'

interface StudentListItem {
  id: number
  fullName: string
  email: string
  createdAt: string
  profile: {
    nim: string | null
    phone: string | null
    address: string | null
    birthPlace: string | null
    birthDate: string | null
    jurusan: string | null
    prodi: string | null
    fotoProfil: string | null
    hobi: string | null
    pesanKesan: string | null
  }
  documents: {
    sertifikatUrl: string | null
    ktmUrl: string | null
  }
}

const dashboardMenu = [
  { label: 'Dashboard Admin', to: '/dashboard-admin', icon: 'heroicons:home-modern-20-solid' },
  { label: 'Beranda Website', to: '/', icon: 'heroicons:globe-alt-20-solid' },
]

const auth = useAuthStore()
const students = ref<StudentListItem[]>([])
const selected = ref<StudentListItem | null>(null)
const loading = ref(false)
const message = ref('')
const errorMessage = ref('')

const totalStudents = computed(() => students.value.length)

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

const resolveFileUrl = (relativePath: string | null) => {
  if (!relativePath) return undefined
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) return relativePath
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? `${window.location.protocol}//${window.location.hostname}:4000`
  return `${apiBase}${relativePath}`
}

const editStudent = (student: StudentListItem) => {
  selected.value = JSON.parse(JSON.stringify(student)) as StudentListItem
  message.value = ''
  errorMessage.value = ''
}

const saveStudent = async () => {
  if (!selected.value) return
  errorMessage.value = ''
  message.value = ''
  try {
    await apiRequest(`/api/admin/students/${selected.value.id}`, {
      method: 'PUT',
      token: auth.state.token,
      body: {
        fullName: selected.value.fullName,
        email: selected.value.email,
        nim: selected.value.profile.nim,
        phone: selected.value.profile.phone,
        address: selected.value.profile.address,
        birthPlace: selected.value.profile.birthPlace,
        birthDate: selected.value.profile.birthDate,
        jurusan: selected.value.profile.jurusan,
        prodi: selected.value.profile.prodi,
        hobi: selected.value.profile.hobi,
        pesanKesan: selected.value.profile.pesanKesan,
      },
    })
    message.value = 'Data mahasiswa berhasil disimpan.'
    await loadStudents()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal menyimpan data.'
  }
}

const deleteStudent = async (id: number) => {
  if (!confirm('Hapus mahasiswa ini?')) return
  errorMessage.value = ''
  message.value = ''
  try {
    await apiRequest(`/api/admin/students/${id}`, {
      method: 'DELETE',
      token: auth.state.token,
    })
    message.value = 'Mahasiswa berhasil dihapus.'
    if (selected.value?.id === id) selected.value = null
    await loadStudents()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal menghapus mahasiswa.'
  }
}

onMounted(loadStudents)
</script>

<template>
  <DashboardShell title="Dashboard Admin" subtitle="Kelola data mahasiswa dan dokumen PKKMB" :menu="dashboardMenu">
    <section class="grid gap-4 md:grid-cols-3">
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-xs uppercase tracking-wider text-slate-500">Total Mahasiswa</p>
        <h2 class="mt-2 text-3xl font-extrabold text-slate-900">{{ totalStudents }}</h2>
      </article>
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
        <p class="text-xs uppercase tracking-wider text-slate-500">Status</p>
        <p class="mt-2 text-sm text-slate-600">Gunakan panel kanan untuk edit biodata dan validasi berkas.</p>
      </article>
    </section>

    <section class="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-900">Data Mahasiswa</h3>
        </div>
        <p v-if="loading" class="text-sm text-slate-600">Memuat data...</p>
        <p v-else-if="students.length === 0" class="text-sm text-slate-600">Belum ada data mahasiswa.</p>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-200 text-slate-500">
                <th class="px-3 py-2">Nama</th>
                <th class="px-3 py-2">NIM</th>
                <th class="px-3 py-2">Prodi</th>
                <th class="px-3 py-2">Berkas</th>
                <th class="px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.id" class="border-b border-slate-100">
                <td class="px-3 py-3">
                  <p class="font-semibold text-slate-800">{{ student.fullName }}</p>
                  <p class="text-xs text-slate-500">{{ student.email }}</p>
                </td>
                <td class="px-3 py-3 text-slate-700">{{ student.profile.nim || '-' }}</td>
                <td class="px-3 py-3 text-slate-700">{{ student.profile.prodi || '-' }}</td>
                <td class="px-3 py-3 text-xs text-slate-600">
                  <p>Sertifikat: {{ student.documents.sertifikatUrl ? 'Ada' : 'Belum' }}</p>
                  <p>KTM: {{ student.documents.ktmUrl ? 'Ada' : 'Belum' }}</p>
                </td>
                <td class="px-3 py-3">
                  <div class="flex gap-2">
                    <button class="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white" @click="editStudent(student)">
                      Edit
                    </button>
                    <button class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500" @click="deleteStudent(student.id)">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="text-lg font-bold text-slate-900">Detail Mahasiswa</h3>
        <p v-if="!selected" class="mt-4 text-sm text-slate-600">Pilih mahasiswa dari tabel untuk edit data.</p>
        <form v-else class="mt-4 space-y-3" @submit.prevent="saveStudent">
          <input v-model="selected.fullName" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="selected.email" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="selected.profile.nim" placeholder="NIM" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="selected.profile.jurusan" placeholder="Jurusan" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="selected.profile.prodi" placeholder="Prodi" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input v-model="selected.profile.hobi" placeholder="Hobi" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <textarea v-model="selected.profile.pesanKesan" placeholder="Pesan dan kesan" rows="2" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <div class="grid grid-cols-2 gap-2 text-xs">
            <a v-if="selected.documents.sertifikatUrl" :href="resolveFileUrl(selected.documents.sertifikatUrl)" target="_blank" class="rounded-lg border border-slate-300 px-2 py-1 text-center">
              Lihat Sertifikat
            </a>
            <a v-if="selected.documents.ktmUrl" :href="resolveFileUrl(selected.documents.ktmUrl)" target="_blank" class="rounded-lg border border-slate-300 px-2 py-1 text-center">
              Lihat KTM
            </a>
          </div>
          <button type="submit" class="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">
            Simpan Perubahan
          </button>
        </form>
        <p v-if="message" class="mt-3 text-sm font-semibold text-green-600">{{ message }}</p>
        <p v-if="errorMessage" class="mt-3 text-sm font-semibold text-red-600">{{ errorMessage }}</p>
      </article>
    </section>
  </DashboardShell>
</template>
