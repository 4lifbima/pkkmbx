<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  title: string
  description: string
  icon: string
}>()
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary">
      <Icon :icon="icon" />
    </div>
    <h3 class="mt-4 text-lg font-bold text-slate-900">{{ title }}</h3>
    <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ description }}</p>
  </article>
</template>
