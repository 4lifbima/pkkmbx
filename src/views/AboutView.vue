<script setup lang="ts">
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
</script>

<template>
  <Header />
  <main class="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
    <section v-reveal class="rounded-3xl border border-slate-200 bg-white p-6 md:p-10">
      <p class="text-sm font-semibold uppercase tracking-wider text-primary">Tentang PKKMB</p>
      <h1 class="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">PKKMB Teknik Informatika FT UNG</h1>
      <p class="mt-5 text-sm leading-relaxed text-slate-700 md:text-base">
        PKKMB dirancang sebagai proses pengenalan kehidupan kampus yang membantu mahasiswa baru memahami lingkungan
        akademik, etika, budaya organisasi, serta arah pengembangan kompetensi di era digital.
      </p>
      <p class="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">
        Melalui kegiatan ini, mahasiswa diharapkan mampu beradaptasi, membangun jejaring kolaboratif, dan mengenal
        berbagai peluang pengembangan diri di Program Studi Teknik Informatika FT UNG.
      </p>
    </section>
  </main>
  <Footer />
</template>
