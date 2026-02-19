<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'

const agendaItems = [
  {
    day: 'Hari 1',
    title: 'Pembukaan dan Pengenalan Kampus',
    time: '08.00 - 12.00 WITA',
    place: 'Aula Fakultas Teknik',
    icon: 'heroicons:academic-cap-20-solid',
  },
  {
    day: 'Hari 2',
    title: 'Pengenalan Prodi dan Organisasi',
    time: '08.00 - 12.30 WITA',
    place: 'Gedung Teknik Informatika',
    icon: 'heroicons:users-20-solid',
  },
  {
    day: 'Hari 3',
    title: 'Workshop Literasi Digital',
    time: '09.00 - 14.00 WITA',
    place: 'Laboratorium Komputer',
    icon: 'heroicons:computer-desktop-20-solid',
  },
]
</script>

<template>
  <Header />
  <main class="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
    <section class="rounded-3xl bg-gradient-to-br from-primary/10 via-white to-sky-100 p-6 md:p-10">
      <p class="text-sm font-semibold uppercase tracking-wider text-primary">Agenda PKKMB</p>
      <h1 class="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Rangkaian Kegiatan PKKMB 2026</h1>
      <p class="mt-4 max-w-2xl text-sm text-slate-600 md:text-base">
        Halaman ini memuat jadwal utama PKKMB Teknik Informatika FT UNG agar mahasiswa baru bisa mempersiapkan diri
        dengan baik.
      </p>
    </section>

    <section v-reveal class="mt-8 grid gap-4 md:grid-cols-3">
      <article
        v-for="item in agendaItems"
        :key="item.day"
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon :icon="item.icon" class="text-xl" />
        </div>
        <p class="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">{{ item.day }}</p>
        <h2 class="mt-2 text-lg font-bold text-slate-900">{{ item.title }}</h2>
        <ul class="mt-4 space-y-2 text-sm text-slate-600">
          <li class="flex items-center gap-2">
            <Icon icon="heroicons:clock-20-solid" class="text-base text-slate-500" />
            {{ item.time }}
          </li>
          <li class="flex items-center gap-2">
            <Icon icon="heroicons:map-pin-20-solid" class="text-base text-slate-500" />
            {{ item.place }}
          </li>
        </ul>
      </article>
    </section>
  </main>
  <Footer />
</template>
