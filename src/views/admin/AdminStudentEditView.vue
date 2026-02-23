<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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

interface ProdiItem { id: number; nama: string }
interface JurusanItem { id: number; nama: string; prodis: ProdiItem[] }

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const studentId = Number(route.params.id)

const loading = ref(true)
const saving = ref(false)
const message = ref('')
const errorMessage = ref('')

const jurusans = ref<JurusanItem[]>([])
const selectedJurusanId = ref<number | ''>('')
const selectedProdiId = ref<number | ''>('')

const filteredProdis = computed(() => {
  if (!selectedJurusanId.value) return []
  const j = jurusans.value.find((x) => x.id === Number(selectedJurusanId.value))
  return j ? j.prodis : []
})

const form = reactive({
  fullName: '',
  email: '',
  nim: '',
  phone: '',
  address: '',
  birthPlace: '',
  birthDate: '',
  hobi: '',
  pesanKesan: '',
})

const documents = reactive({
  sertifikatUrl: null as string | null,
  ktmUrl: null as string | null,
})

const resolveFileUrl = (relativePath: string | null) => {
  if (!relativePath) return null
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) return relativePath
  const apiBase = import.meta.env.VITE_API_BASE_URL ?? `${window.location.protocol}//${window.location.hostname}:8000`
  return `${apiBase}${relativePath}`
}

const onJurusanChange = () => {
  selectedProdiId.value = ''
}

const loadJurusans = async () => {
  try {
    jurusans.value = await apiRequest<JurusanItem[]>('/api/jurusans', { token: auth.state.token })
  } catch { /* silent */ }
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

const loadStudent = async () => {
  loading.value = true
  try {
    const data = await apiRequest<any>(`/api/admin/students/${studentId}`, { token: auth.state.token })
    form.fullName = data.fullName
    form.email = data.email
    form.nim = data.profile?.nim || ''
    form.phone = data.profile?.phone || ''
    form.address = data.profile?.address || ''
    form.birthPlace = data.profile?.birthPlace || ''
    form.birthDate = data.profile?.birthDate || ''
    form.hobi = data.profile?.hobi || ''
    form.pesanKesan = data.profile?.pesanKesan || ''
    documents.sertifikatUrl = data.documents?.sertifikatUrl
    documents.ktmUrl = data.documents?.ktmUrl
    matchJurusanFromProdiId(data.profile?.prodiId)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal memuat data.'
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  saving.value = true
  errorMessage.value = ''
  message.value = ''
  try {
    await apiRequest(`/api/admin/students/${studentId}`, {
      method: 'PUT',
      token: auth.state.token,
      body: {
        ...form,
        prodiId: selectedProdiId.value || null,
      },
    })
    message.value = 'Data berhasil diperbarui!'
    setTimeout(() => router.push('/dashboard-admin/mahasiswa'), 1200)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal menyimpan data.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await loadJurusans()
  await loadStudent()
})
</script>

<template>
  <DashboardShell title="Edit Mahasiswa" subtitle="Perbarui data mahasiswa" :menu="dashboardMenu">
    <div class="mx-auto max-w-2xl">
      <router-link
        to="/dashboard-admin/mahasiswa"
        class="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-primary"
      >
        <Icon icon="heroicons:arrow-left-20-solid" class="text-base" />
        Kembali ke daftar
      </router-link>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>

      <article v-else class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-bold text-slate-900">Edit: {{ form.fullName }}</h2>

        <p v-if="message" class="mt-3 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
          {{ message }}
        </p>
        <p v-if="errorMessage" class="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {{ errorMessage }}
        </p>

        <form class="mt-5 grid gap-4 md:grid-cols-2" @submit.prevent="submit">
          <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-slate-700">Nama Lengkap</label>
            <input v-model="form.fullName" required class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input v-model="form.email" type="email" required class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
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
          <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-slate-700">Alamat</label>
            <textarea v-model="form.address" rows="2" class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-slate-700">Pesan & Kesan</label>
            <textarea v-model="form.pesanKesan" rows="3" class="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          <!-- Documents preview -->
          <div v-if="documents.sertifikatUrl || documents.ktmUrl" class="flex gap-3 md:col-span-2">
            <a
              v-if="documents.sertifikatUrl"
              :href="resolveFileUrl(documents.sertifikatUrl) || '#'"
              target="_blank"
              class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-primary hover:text-primary"
            >
              <Icon icon="heroicons:document-20-solid" class="text-sm" />
              Lihat Sertifikat
            </a>
            <a
              v-if="documents.ktmUrl"
              :href="resolveFileUrl(documents.ktmUrl) || '#'"
              target="_blank"
              class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-primary hover:text-primary"
            >
              <Icon icon="heroicons:identification-20-solid" class="text-sm" />
              Lihat KTM
            </a>
          </div>

          <div class="md:col-span-2">
            <button
              type="submit"
              :disabled="saving"
              class="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </article>
    </div>
  </DashboardShell>
</template>
