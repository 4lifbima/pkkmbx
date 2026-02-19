<script setup lang="ts">
import type { ChartItem } from '../types'

defineProps<{
  title?: string
  items: ChartItem[]
}>()
</script>

<template>
  <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
    <h2 class="text-xl font-bold text-slate-900">
      {{ title ?? 'Statistik Peminat Berdasarkan Jalur Masuk' }}
    </h2>
    <div class="mt-6 space-y-4">
      <div v-for="item in items" :key="item.label">
        <div class="mb-2 flex items-center justify-between text-sm text-slate-600">
          <span>{{ item.label }}</span>
          <span class="font-semibold text-slate-800">{{ item.value }}%</span>
        </div>
        <div class="h-3 rounded-full bg-slate-100">
          <div
            class="h-3 rounded-full bg-gradient-to-r from-primary to-indigo-400"
            :style="{ width: `${item.value}%` }"
          />
        </div>
      </div>
    </div>
  </section>
</template>
