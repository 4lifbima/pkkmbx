<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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
const loading = ref(true)
const jurusans = ref<JurusanItem[]>([])
const message = ref('')
const errorMessage = ref('')

// Jurusan forms
const newJurusanName = ref('')
const addingJurusan = ref(false)
const editJurusanId = ref<number | null>(null)
const editJurusanName = ref('')

// Prodi forms
const newProdiJurusanId = ref<number | null>(null)
const newProdiName = ref('')
const addingProdi = ref(false)
const editProdiId = ref<number | null>(null)
const editProdiName = ref('')

// Delete modal
const showDeleteModal = ref(false)
const deleteType = ref<'jurusan' | 'prodi'>('jurusan')
const deleteId = ref(0)
const deleteName = ref('')
const deleting = ref(false)

const isAddJurusanDisabled = computed(() => addingJurusan.value || newJurusanName.value.trim().length === 0)
const isAddProdiDisabled = computed(() => addingProdi.value || newProdiName.value.trim().length === 0)

const loadJurusans = async () => {
  loading.value = true
  try {
    jurusans.value = await apiRequest<JurusanItem[]>('/api/jurusans', { token: auth.state.token })
  } catch {
    errorMessage.value = 'Gagal memuat data jurusan.'
  } finally {
    loading.value = false
  }
}

const addJurusan = async () => {
  if (newJurusanName.value.trim().length === 0) return
  addingJurusan.value = true
  errorMessage.value = ''
  message.value = ''
  try {
    await apiRequest('/api/admin/jurusans', { method: 'POST', token: auth.state.token, body: { nama: newJurusanName.value.trim() } })
    message.value = 'Jurusan berhasil ditambahkan.'
    newJurusanName.value = ''
    await loadJurusans()
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Gagal menambahkan.'
  } finally {
    addingJurusan.value = false
  }
}

const startEditJurusan = (j: JurusanItem) => {
  editJurusanId.value = j.id
  editJurusanName.value = j.nama
}

const saveEditJurusan = async () => {
  if (!editJurusanId.value || !editJurusanName.value.trim()) return
  errorMessage.value = ''
  message.value = ''
  try {
    await apiRequest(`/api/admin/jurusans/${editJurusanId.value}`, { method: 'PUT', token: auth.state.token, body: { nama: editJurusanName.value } })
    message.value = 'Jurusan berhasil diperbarui.'
    editJurusanId.value = null
    await loadJurusans()
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Gagal memperbarui.'
  }
}

const addProdi = async (jurusanId: number) => {
  if (newProdiName.value.trim().length === 0) return
  addingProdi.value = true
  errorMessage.value = ''
  message.value = ''
  try {
    await apiRequest(`/api/admin/jurusans/${jurusanId}/prodis`, { method: 'POST', token: auth.state.token, body: { nama: newProdiName.value.trim() } })
    message.value = 'Prodi berhasil ditambahkan.'
    newProdiName.value = ''
    newProdiJurusanId.value = null
    await loadJurusans()
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Gagal menambahkan.'
  } finally {
    addingProdi.value = false
  }
}

const startEditProdi = (p: ProdiItem) => {
  editProdiId.value = p.id
  editProdiName.value = p.nama
}

const saveEditProdi = async () => {
  if (!editProdiId.value || !editProdiName.value.trim()) return
  errorMessage.value = ''
  message.value = ''
  try {
    await apiRequest(`/api/admin/prodis/${editProdiId.value}`, { method: 'PUT', token: auth.state.token, body: { nama: editProdiName.value } })
    message.value = 'Prodi berhasil diperbarui.'
    editProdiId.value = null
    await loadJurusans()
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Gagal memperbarui.'
  }
}

const confirmDelete = (type: 'jurusan' | 'prodi', id: number, nama: string) => {
  deleteType.value = type
  deleteId.value = id
  deleteName.value = nama
  showDeleteModal.value = true
}

const doDelete = async () => {
  deleting.value = true
  errorMessage.value = ''
  message.value = ''
  const url = deleteType.value === 'jurusan' ? `/api/admin/jurusans/${deleteId.value}` : `/api/admin/prodis/${deleteId.value}`
  try {
    await apiRequest(url, { method: 'DELETE', token: auth.state.token })
    message.value = `${deleteType.value === 'jurusan' ? 'Jurusan' : 'Prodi'} berhasil dihapus.`
    showDeleteModal.value = false
    await loadJurusans()
  } catch (e) {
    errorMessage.value = e instanceof Error ? e.message : 'Gagal menghapus.'
  } finally {
    deleting.value = false
  }
}

onMounted(loadJurusans)
</script>

<template>
  <DashboardShell title="Master Jurusan &amp; Prodi" subtitle="Kelola data jurusan dan program studi" :menu="dashboardMenu">
    <div class="space-y-4">
      <!-- Add Jurusan -->
      <div class="flex flex-col gap-3 sm:flex-row">
        <input
          v-model="newJurusanName"
          placeholder="Nama jurusan baru..."
          class="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          @keyup.enter="addJurusan"
        />
        <button
          :disabled="isAddJurusanDisabled"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          @click="addJurusan"
        >
          <Icon icon="heroicons:plus-20-solid" class="text-lg" />
          Tambah Jurusan
        </button>
      </div>

      <p v-if="message" class="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">{{ message }}</p>
      <p v-if="errorMessage" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{{ errorMessage }}</p>

      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>

      <div v-else-if="jurusans.length === 0" class="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
        Belum ada data jurusan.
      </div>

      <!-- Jurusan Accordion Cards -->
      <div v-else class="space-y-4">
        <article v-for="j in jurusans" :key="j.id" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <!-- Jurusan Header -->
          <div class="flex items-center justify-between bg-slate-50/50 px-5 py-4">
            <div v-if="editJurusanId === j.id" class="flex flex-1 gap-2">
              <input v-model="editJurusanName" class="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm" @keyup.enter="saveEditJurusan" />
              <button class="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white" @click="saveEditJurusan">Simpan</button>
              <button class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600" @click="editJurusanId = null">Batal</button>
            </div>
            <div v-else class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon icon="heroicons:building-library-20-solid" class="text-base" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900">{{ j.nama }}</h3>
                <p class="text-xs text-slate-500">{{ j.prodis.length }} program studi</p>
              </div>
            </div>
            <div v-if="editJurusanId !== j.id" class="flex gap-1.5">
              <button class="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 transition hover:border-primary hover:text-primary" @click="startEditJurusan(j)">
                <Icon icon="heroicons:pencil-square-20-solid" class="mx-auto text-sm" />
              </button>
              <button class="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-300 hover:text-red-500" @click="confirmDelete('jurusan', j.id, j.nama)">
                <Icon icon="heroicons:trash-20-solid" class="mx-auto text-sm" />
              </button>
            </div>
          </div>

          <!-- Prodi List -->
          <div class="border-t border-slate-100 px-5 py-4">
            <div v-if="j.prodis.length === 0" class="py-3 text-center text-xs text-slate-400">Belum ada prodi.</div>
            <div v-else class="space-y-2">
              <div v-for="p in j.prodis" :key="p.id" class="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5">
                <div v-if="editProdiId === p.id" class="flex flex-1 gap-2">
                  <input v-model="editProdiName" class="flex-1 rounded-lg border border-slate-300 px-3 py-1 text-xs" @keyup.enter="saveEditProdi" />
                  <button class="rounded-lg bg-primary px-2 py-1 text-[10px] font-semibold text-white" @click="saveEditProdi">OK</button>
                  <button class="rounded-lg border border-slate-300 px-2 py-1 text-[10px] font-semibold text-slate-600" @click="editProdiId = null">×</button>
                </div>
                <span v-else class="text-sm font-medium text-slate-700">{{ p.nama }}</span>
                <div v-if="editProdiId !== p.id" class="flex gap-1">
                  <button class="h-7 w-7 rounded-md text-slate-400 transition hover:text-primary" @click="startEditProdi(p)">
                    <Icon icon="heroicons:pencil-20-solid" class="mx-auto text-xs" />
                  </button>
                  <button class="h-7 w-7 rounded-md text-slate-400 transition hover:text-red-500" @click="confirmDelete('prodi', p.id, p.nama)">
                    <Icon icon="heroicons:x-mark-20-solid" class="mx-auto text-xs" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Add Prodi Form -->
            <div class="mt-3">
              <div v-if="newProdiJurusanId === j.id" class="flex gap-2">
                <input
                  v-model="newProdiName"
                  placeholder="Nama prodi baru..."
                  class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs transition focus:border-primary focus:outline-none"
                  @keyup.enter="addProdi(j.id)"
                />
                <button
                  :disabled="isAddProdiDisabled"
                  class="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  @click="addProdi(j.id)"
                >
                  Tambah
                </button>
                <button class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600" @click="newProdiJurusanId = null">
                  Batal
                </button>
              </div>
              <button
                v-else
                class="inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:underline"
                @click="newProdiJurusanId = j.id; newProdiName = ''"
              >
                <Icon icon="heroicons:plus-20-solid" class="text-sm" />
                Tambah Prodi
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Delete Modal -->
    <Teleport to="body">
      <Transition name="fade-slide">
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" @click.self="showDeleteModal = false">
          <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Icon icon="heroicons:exclamation-triangle-20-solid" class="text-2xl text-red-500" />
            </div>
            <h3 class="text-center text-lg font-bold text-slate-900">Hapus {{ deleteType === 'jurusan' ? 'Jurusan' : 'Prodi' }}?</h3>
            <p class="mt-2 text-center text-sm text-slate-500">
              <strong>{{ deleteName }}</strong> akan dihapus permanen{{ deleteType === 'jurusan' ? ' beserta semua prodi di dalamnya' : '' }}.
            </p>
            <div class="mt-6 flex gap-3">
              <button class="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" @click="showDeleteModal = false">Batal</button>
              <button :disabled="deleting" class="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60" @click="doDelete">
                {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </DashboardShell>
</template>
