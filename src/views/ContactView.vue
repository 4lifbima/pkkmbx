<script setup lang="ts">
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
</script>

<template>
  <Header />
  <main class="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
    <section v-reveal class="grid gap-6 md:grid-cols-2">
      <article class="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <p class="text-sm font-semibold uppercase tracking-wider text-primary">Kontak Panitia</p>
        <h1 class="mt-3 text-3xl font-extrabold text-slate-900">Hubungi Kami</h1>
        <ul class="mt-6 space-y-3 text-sm text-slate-700 md:text-base">
          <li>Email: pkkmb.informatika@ung.ac.id</li>
          <li>Instagram: @informatika_ung</li>
          <li>TikTok: @pkkmb_if_ung</li>
          <li>Lokasi: Fakultas Teknik Universitas Negeri Gorontalo</li>
        </ul>
      </article>

      <article class="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
        <h2 class="text-xl font-bold text-slate-900">Jam Operasional</h2>
        <p class="mt-4 text-sm text-slate-700 md:text-base">Senin - Jumat: 08.00 - 16.00 WITA</p>
        <p class="mt-2 text-sm text-slate-700 md:text-base">Sabtu: 09.00 - 13.00 WITA</p>
      </article>
    </section>
  </main>
  <Footer />
</template>
