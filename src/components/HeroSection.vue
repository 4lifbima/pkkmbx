<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-white to-sky-100 px-6 py-12 md:px-10 md:py-16 -mt-16 lg:mt-0">
    <div class="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <p class="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          PKKMB 2026
        </p>
        <h1 class="mt-4 text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">
          Selamat Datang di PKKMB Teknik Informatika FT UNG
        </h1>
        <p class="mt-4 max-w-xl text-base text-slate-600 md:text-lg">
          Membangun Generasi Digital yang Kreatif dan Inovatif melalui pengalaman kampus yang inspiratif.
        </p>
        <div class="mt-8 flex flex-cols gap-3">
          <button class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark">
            <Icon icon="heroicons:user-plus-20-solid" />
           <p class="text-xs lg:text-sm">Daftar Sekarang</p> 
          </button>
          <router-link
            to="/agenda"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
          >
            <Icon icon="heroicons:calendar-days-20-solid" />
            <p class="text-xs lg:text-sm">Lihat Agenda</p> 
          </router-link>
        </div>
      </div>

      <div class="relative">
        <div class=" rounded-2xl border border-white/70">
          <img
            src="/herro.png"
            alt="Mahasiswa PKKMB Teknik Informatika FT UNG"
            class="h-full lg:min-h-[340px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
</template>
