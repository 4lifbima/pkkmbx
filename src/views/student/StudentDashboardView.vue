<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import DashboardShell from '../../components/dashboard/DashboardShell.vue'
import { apiRequest, apiUpload } from '../../lib/api'
import { useAuthStore } from '../../stores/auth'
import type { StudentProfile } from '../../types/auth'
import { Icon } from '@iconify/vue'

const dashboardMenu = [
  { label: 'Dashboard Mahasiswa', to: '/dashboard-mahasiswa', icon: 'heroicons:user-circle-20-solid' },
  { label: 'Beranda Website', to: '/', icon: 'heroicons:globe-alt-20-solid' },
]

interface ProdiItem { id: number; nama: string }
interface JurusanItem { id: number; nama: string; prodis: ProdiItem[] }

const auth = useAuthStore()
const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)
const message = ref('')
const errorMessage = ref('')
const activeTab = ref<'biodata' | 'berkas'>('biodata')

const jurusans = ref<JurusanItem[]>([])
const selectedJurusanId = ref<number | ''>('')
const selectedProdiId = ref<number | ''>('')

const filteredProdis = computed(() => {
  if (!selectedJurusanId.value) return []
  const j = jurusans.value.find((x) => x.id === Number(selectedJurusanId.value))
  return j ? j.prodis : []
})

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
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ?? `${window.location.protocol}//${window.location.hostname}:8000`
  return `${apiBase}${relativePath}`
}

const profileCompletion = computed(() => {
  const fields = [form.fullName, form.nim, form.phone, form.address, form.birthPlace, form.birthDate, form.prodi]
  const filled = fields.filter((f) => f && f.trim && f.trim().length > 0).length
  return Math.round((filled / fields.length) * 100)
})

const onJurusanChange = () => {
  selectedProdiId.value = ''
}

const matchJurusanFromProdiId = (prodiId: number | null) => {
  if (!prodiId) return
  for (const j of jurusans.value) {
    const found = j.prodis.find((p) => p.id === prodiId)
    if (found) {
      selectedJurusanId.value = j.id
      selectedProdiId.value = found.id
      return
    }
  }
}

const loadJurusans = async () => {
  try {
    jurusans.value = await apiRequest<JurusanItem[]>('/api/jurusans', { token: auth.state.token })
  } catch { /* silent */ }
}

const loadProfile = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const profile = await apiRequest<any>('/api/student/profile', { token: auth.state.token })
    form.id = profile.id
    form.fullName = profile.fullName || ''
    form.email = profile.email || ''
    form.nim = profile.nim || ''
    form.phone = profile.phone || ''
    form.address = profile.address || ''
    form.birthPlace = profile.birthPlace || ''
    form.birthDate = profile.birthDate || ''
    form.jurusan = profile.jurusan || ''
    form.prodi = profile.prodi || ''
    form.fotoProfil = profile.fotoProfil || ''
    form.hobi = profile.hobi || ''
    form.pesanKesan = profile.pesanKesan || ''
    form.sertifikatUrl = profile.sertifikatUrl || ''
    form.ktmUrl = profile.ktmUrl || ''
    matchJurusanFromProdiId(profile.prodiId)
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
        prodiId: selectedProdiId.value || null,
        hobi: form.hobi || null,
        pesanKesan: form.pesanKesan || null,
      },
    })
    message.value = 'Biodata berhasil disimpan!'
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
    message.value = 'File berhasil diupload!'
    await loadProfile()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Upload gagal.'
  } finally {
    uploading.value = false
    target.value = ''
  }
}

onMounted(async () => {
  await loadJurusans()
  await loadProfile()
})
</script>

<template>
  <DashboardShell title="Dashboard Mahasiswa" subtitle="Kelola biodata dan berkas PKKMB kamu" :menu="dashboardMenu">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>

    <div v-else class="space-y-6">
      <!-- Profile header -->
      <section class="flex flex-col items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start">
        <div class="relative flex-shrink-0">
          <img
            v-if="form.fotoProfil"
            :src="resolveFileUrl(form.fotoProfil) || ''"
            class="h-20 w-20 rounded-full object-cover ring-4 ring-primary/20"
          />
          <div
            v-else
            class="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-2xl font-extrabold text-primary ring-4 ring-primary/10"
          >
            {{ (form.fullName || 'U').charAt(0).toUpperCase() }}
          </div>
          <label
            class="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md transition hover:bg-primary/90"
            title="Ganti foto profil"
          >
            <Icon icon="heroicons:camera-20-solid" class="text-sm" />
            <input type="file" accept="image/*" class="hidden" @change="uploadFile($event, 'profile')" />
          </label>
        </div>
        <div class="flex-1 text-center sm:text-left">
          <h2 class="text-xl font-extrabold text-slate-900">{{ form.fullName || 'Mahasiswa Baru' }}</h2>
          <p class="text-sm text-slate-500">{{ form.email }}</p>
          <div class="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span v-if="form.nim" class="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              NIM: {{ form.nim }}
            </span>
            <span v-if="form.prodi" class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {{ form.prodi }}
            </span>
          </div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <div class="relative h-16 w-16">
            <svg viewBox="0 0 36 36" class="h-full w-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" stroke-width="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round"
                :stroke-dasharray="`${profileCompletion}, 100`"
                class="text-primary transition-all duration-700"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-xs font-extrabold text-slate-900">{{ profileCompletion }}%</span>
            </div>
          </div>
          <span class="text-[10px] font-medium text-slate-400">Profil</span>
        </div>
      </section>

      <!-- Tabs -->
      <div class="flex gap-1 rounded-xl bg-slate-100 p-1">
        <button
          class="flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition"
          :class="activeTab === 'biodata' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          @click="activeTab = 'biodata'"
        >
          <Icon icon="heroicons:user-20-solid" class="mr-1.5 inline text-base" />
          Biodata
        </button>
        <button
          class="flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition"
          :class="activeTab === 'berkas' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'"
          @click="activeTab = 'berkas'"
        >
          <Icon icon="heroicons:document-arrow-up-20-solid" class="mr-1.5 inline text-base" />
          Berkas
        </button>
      </div>

      <!-- Messages -->
      <p v-if="message" class="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
        {{ message }}
      </p>
      <p v-if="errorMessage" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
        {{ errorMessage }}
      </p>

      <!-- Biodata Tab -->
      <section v-if="activeTab === 'biodata'">
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-base font-bold text-slate-900">Biodata Pribadi</h3>
          <form class="mt-5 grid gap-4 sm:grid-cols-2" @submit.prevent="saveProfile">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-slate-700">Nama Lengkap</label>
              <input v-model="form.fullName" required class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input v-model="form.email" disabled class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">NIM</label>
              <input v-model="form.nim" class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Jurusan</label>
              <select
                v-model="selectedJurusanId"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                @change="onJurusanChange"
              >
                <option value="">-- Pilih Jurusan --</option>
                <option v-for="j in jurusans" :key="j.id" :value="j.id">{{ j.nama }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Program Studi</label>
              <select
                v-model="selectedProdiId"
                :disabled="!selectedJurusanId"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">-- Pilih Prodi --</option>
                <option v-for="p in filteredProdis" :key="p.id" :value="p.id">{{ p.nama }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Nomor HP</label>
              <input v-model="form.phone" class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Tempat Lahir</label>
              <input v-model="form.birthPlace" class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Tanggal Lahir</label>
              <input v-model="form.birthDate" type="date" class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-700">Hobi</label>
              <input v-model="form.hobi" class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-slate-700">Alamat</label>
              <textarea v-model="form.address" rows="2" class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div class="sm:col-span-2">
              <label class="mb-1 block text-sm font-medium text-slate-700">Pesan & Kesan</label>
              <textarea v-model="form.pesanKesan" rows="3" class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div class="sm:col-span-2">
              <button
                type="submit"
                :disabled="saving"
                class="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{ saving ? 'Menyimpan...' : 'Simpan Biodata' }}
              </button>
            </div>
          </form>
        </article>
      </section>

      <!-- Berkas Tab -->
      <section v-if="activeTab === 'berkas'" class="grid gap-5 sm:grid-cols-2">
        <!-- Sertifikat Card -->
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
              <Icon icon="heroicons:document-check-20-solid" class="text-xl" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900">Sertifikat Prestasi</h3>
              <p class="text-xs text-slate-500">Format: PDF atau Gambar</p>
            </div>
          </div>
          <div v-if="form.sertifikatUrl" class="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-emerald-700">
                <Icon icon="heroicons:check-circle-20-solid" class="mr-1 inline text-sm" />
                File terupload
              </span>
              <a
                :href="resolveFileUrl(form.sertifikatUrl) || '#'"
                target="_blank"
                class="text-xs font-semibold text-primary hover:underline"
              >
                Lihat →
              </a>
            </div>
          </div>
          <label class="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-6 transition hover:border-primary hover:bg-primary/5">
            <Icon icon="heroicons:cloud-arrow-up-20-solid" class="text-3xl text-slate-400" />
            <span class="text-xs font-medium text-slate-500">Klik untuk upload sertifikat</span>
            <input type="file" accept=".pdf,image/*" class="hidden" @change="uploadFile($event, 'sertifikat')" />
          </label>
        </article>

        <!-- KTM Card -->
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600">
              <Icon icon="heroicons:identification-20-solid" class="text-xl" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900">Kartu Tanda Mahasiswa</h3>
              <p class="text-xs text-slate-500">Format: PDF atau Gambar</p>
            </div>
          </div>
          <div v-if="form.ktmUrl" class="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-emerald-700">
                <Icon icon="heroicons:check-circle-20-solid" class="mr-1 inline text-sm" />
                File terupload
              </span>
              <a
                :href="resolveFileUrl(form.ktmUrl) || '#'"
                target="_blank"
                class="text-xs font-semibold text-primary hover:underline"
              >
                Lihat →
              </a>
            </div>
          </div>
          <label class="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 p-6 transition hover:border-primary hover:bg-primary/5">
            <Icon icon="heroicons:cloud-arrow-up-20-solid" class="text-3xl text-slate-400" />
            <span class="text-xs font-medium text-slate-500">Klik untuk upload KTM</span>
            <input type="file" accept=".pdf,image/*" class="hidden" @change="uploadFile($event, 'ktm')" />
          </label>
        </article>

        <p v-if="uploading" class="col-span-full text-center text-sm text-slate-500">
          <Icon icon="heroicons:arrow-path-20-solid" class="mr-1 inline animate-spin text-sm" />
          Mengupload file...
        </p>
      </section>
    </div>
  </DashboardShell>
</template>
