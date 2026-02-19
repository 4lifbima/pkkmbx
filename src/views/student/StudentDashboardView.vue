<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import DashboardShell from '../../components/dashboard/DashboardShell.vue'
import { apiRequest, apiUpload } from '../../lib/api'
import { useAuthStore } from '../../stores/auth'
import type { StudentProfile } from '../../types/auth'

const dashboardMenu = [
  { label: 'Dashboard Mahasiswa', to: '/dashboard-mahasiswa', icon: 'heroicons:user-circle-20-solid' },
  { label: 'Beranda Website', to: '/', icon: 'heroicons:globe-alt-20-solid' },
]

const auth = useAuthStore()
const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)
const message = ref('')
const errorMessage = ref('')

const form = reactive<StudentProfile>({
  id: 0,
  fullName: '',
  email: '',
  nim: '',
  phone: '',
  address: '',
  birthPlace: '',
  birthDate: '',
  jurusan: '',
  prodi: '',
  fotoProfil: '',
  hobi: '',
  pesanKesan: '',
  sertifikatUrl: '',
  ktmUrl: '',
})

const resolveFileUrl = (relativePath: string | null) => {
  if (!relativePath) return null
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) return relativePath
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? `${window.location.protocol}//${window.location.hostname}:4000`
  return `${apiBase}${relativePath}`
}

const loadProfile = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const profile = await apiRequest<StudentProfile>('/api/student/profile', { token: auth.state.token })
    Object.assign(form, profile)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal memuat biodata.'
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  saving.value = true
  errorMessage.value = ''
  message.value = ''
  try {
    await apiRequest('/api/student/profile', {
      method: 'PUT',
      token: auth.state.token,
      body: {
        fullName: form.fullName,
        nim: form.nim || null,
        phone: form.phone || null,
        address: form.address || null,
        birthPlace: form.birthPlace || null,
        birthDate: form.birthDate || null,
        jurusan: form.jurusan || null,
        prodi: form.prodi || null,
        hobi: form.hobi || null,
        pesanKesan: form.pesanKesan || null,
      },
    })
    message.value = 'Biodata berhasil disimpan.'
    await loadProfile()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal menyimpan biodata.'
  } finally {
    saving.value = false
  }
}

const uploadFile = async (event: Event, type: 'profile' | 'sertifikat' | 'ktm') => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (!selectedFile) return

  const config = {
    profile: { path: '/api/student/upload/profile-photo', field: 'photo' },
    sertifikat: { path: '/api/student/upload/sertifikat', field: 'sertifikat' },
    ktm: { path: '/api/student/upload/ktm', field: 'ktm' },
  }[type]

  uploading.value = true
  errorMessage.value = ''
  message.value = ''
  try {
    await apiUpload<{ url: string; message: string }>(config.path, selectedFile, config.field, auth.state.token)
    message.value = 'File berhasil diupload.'
    await loadProfile()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Upload gagal.'
  } finally {
    uploading.value = false
    target.value = ''
  }
}

onMounted(loadProfile)
</script>

<template>
  <DashboardShell title="Dashboard Mahasiswa" subtitle="Kelola biodata dan berkas PKKMB kamu" :menu="dashboardMenu">
    <section class="grid gap-6 xl:grid-cols-[1fr_360px]">
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900">Biodata Pribadi</h2>
        <p v-if="loading" class="mt-4 text-sm text-slate-600">Memuat biodata...</p>
        <form v-else class="mt-4 grid gap-3 md:grid-cols-2" @submit.prevent="saveProfile">
          <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-slate-700">Nama Lengkap</label>
            <input v-model="form.fullName" required class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input v-model="form.email" disabled class="w-full rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">NIM</label>
            <input v-model="form.nim" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Jurusan</label>
            <input v-model="form.jurusan" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Prodi</label>
            <input v-model="form.prodi" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Nomor HP</label>
            <input v-model="form.phone" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Tempat Lahir</label>
            <input v-model="form.birthPlace" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Tanggal Lahir</label>
            <input v-model="form.birthDate" type="date" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Hobi</label>
            <input v-model="form.hobi" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-slate-700">Alamat</label>
            <textarea v-model="form.address" rows="2" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-slate-700">Pesan & Kesan</label>
            <textarea v-model="form.pesanKesan" rows="3" class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div class="md:col-span-2">
            <button
              type="submit"
              :disabled="saving"
              class="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan Biodata' }}
            </button>
          </div>
        </form>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900">Berkas Mahasiswa</h2>
        <div class="mt-4 space-y-4">
          <div>
            <p class="mb-2 text-sm font-medium text-slate-700">Foto Profil</p>
            <img
              v-if="form.fotoProfil"
              :src="resolveFileUrl(form.fotoProfil) || ''"
              alt="Foto Profil"
              class="mb-2 h-24 w-24 rounded-full object-cover"
            />
            <input type="file" accept="image/*" @change="uploadFile($event, 'profile')" />
          </div>
          <div>
            <p class="mb-2 text-sm font-medium text-slate-700">Upload Sertifikat Prestasi</p>
            <a v-if="form.sertifikatUrl" :href="resolveFileUrl(form.sertifikatUrl) || '#'" target="_blank" class="mb-2 block text-sm text-primary">
              Lihat sertifikat saat ini
            </a>
            <input type="file" accept=".pdf,image/*" @change="uploadFile($event, 'sertifikat')" />
          </div>
          <div>
            <p class="mb-2 text-sm font-medium text-slate-700">Upload KTM</p>
            <a v-if="form.ktmUrl" :href="resolveFileUrl(form.ktmUrl) || '#'" target="_blank" class="mb-2 block text-sm text-primary">
              Lihat KTM saat ini
            </a>
            <input type="file" accept=".pdf,image/*" @change="uploadFile($event, 'ktm')" />
          </div>
          <p v-if="uploading" class="text-sm text-slate-500">Mengupload file...</p>
        </div>
      </article>
    </section>

    <p v-if="message" class="mt-4 text-sm font-semibold text-green-600">{{ message }}</p>
    <p v-if="errorMessage" class="mt-4 text-sm font-semibold text-red-600">{{ errorMessage }}</p>
  </DashboardShell>
</template>
