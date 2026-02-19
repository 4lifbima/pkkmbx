<script setup lang="ts">
const partners = ['BEM FT UNG', 'DPM FT UNG', 'HIMATIF UNG', 'PKKMB UNG']
</script>

<template>
  <section>
    <p class="text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Trusted By</p>
    <div class="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      <div
        v-for="partner in partners"
        :key="partner"
        class="rounded-xl border border-slate-200 bg-white px-4 py-5 text-center text-sm font-semibold text-slate-600"
      >
        {{ partner }}
      </div>
    </div>
  </section>
</template>
