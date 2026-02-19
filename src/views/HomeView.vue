<script setup lang="ts">
import FeatureCard from '../components/FeatureCard.vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import HeroSection from '../components/HeroSection.vue'
import InsightCard from '../components/InsightCard.vue'
import StatisticChart from '../components/StatisticChart.vue'
import TrustedBrands from '../components/TrustedBrands.vue'
import type { ChartItem, FeatureItem, InsightItem } from '../types'

const insights: InsightItem[] = [
  { label: 'Peserta Terdaftar', value: '320+' },
  { label: 'Panitia', value: '45' },
  { label: 'Kegiatan', value: '12' },
  { label: 'Prodi', value: '1' },
]

const features: FeatureItem[] = [
  {
    title: 'Informasi Lengkap',
    description: 'Semua informasi PKKMB dapat diakses dalam satu platform yang jelas dan terstruktur.',
    icon: 'heroicons:information-circle-20-solid',
  },
  {
    title: 'Jadwal Terpadu',
    description: 'Lihat agenda kegiatan harian dengan cepat tanpa perlu berpindah platform.',
    icon: 'heroicons:calendar-days-20-solid',
  },
  {
    title: 'Pengumuman Real-time',
    description: 'Dapatkan update terbaru dari panitia secara langsung melalui halaman utama.',
    icon: 'heroicons:megaphone-20-solid',
  },
]

const chartItems: ChartItem[] = [
  { label: 'SNBP', value: 42 },
  { label: 'SNBT', value: 36 },
  { label: 'Mandiri', value: 22 },
]
</script>

<template>
  <Header />
  <main class="mx-auto w-full max-w-6xl px-0 py-8 md:px-6 md:py-10">
    <HeroSection />

    <section v-reveal class="mt-12 px-4 py-12 md:px-0 md:py-16">
      <h2 class="text-2xl font-bold text-slate-900">Insight Overview</h2>
      <div class="mt-5 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <InsightCard v-for="item in insights" :key="item.label" :label="item.label" :value="item.value" />
      </div>
    </section>

    <section v-reveal class="mt-12 px-4 py-12 md:px-0 md:py-16">
      <StatisticChart :items="chartItems" />
    </section>

    <section v-reveal class="mt-12 px-4 py-12 md:px-0 md:py-16">
      <TrustedBrands />
    </section>

    <section v-reveal class="mt-12 rounded-3xl bg-slate-50 px-4 py-12 md:px-0 md:py-16">
      <h2 class="text-2xl font-bold text-slate-900">Fitur Unggulan</h2>
      <div class="mt-5 grid gap-4 md:grid-cols-3">
        <FeatureCard
          v-for="feature in features"
          :key="feature.title"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon"
        />
      </div>
    </section>

    <section v-reveal class="mt-12 rounded-3xl border border-primary/20 bg-primary/5 px-8 py-12 md:px-2 md:py-16">
      <div class="lg:p-8">
      <h2 class="text-2xl font-bold text-slate-900">Tentang PKKMB</h2>
      <p class="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700 md:text-base">
        PKKMB Teknik Informatika FT UNG adalah rangkaian kegiatan orientasi mahasiswa baru untuk memperkenalkan
        lingkungan akademik, budaya organisasi, serta kompetensi digital yang relevan dengan perkembangan teknologi.
      </p>
      <router-link
        to="/tentang"
        class="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark"
      >
        Pelajari Lebih Lanjut
      </router-link>
    </div>
    </section>
  </main>
  <Footer />
</template>
