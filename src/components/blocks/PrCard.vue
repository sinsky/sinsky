<script setup lang="ts">
defineProps<{ title: string; url: string; comment: string }>();
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="bubble-shape group flex h-full flex-col gap-3 rounded-2xl bg-white/80 p-6 text-slate-800 shadow-sm ring-1 ring-violet-200/60 transition-transform duration-500 hover:-translate-y-1 hover:shadow-md hover:ring-violet-300"
  >
    <div class="flex items-center justify-between gap-3">
      <h4 class="my-0 text-base font-semibold">{{ title }}</h4>
      <span
        class="text-xs font-medium text-emerald-600 opacity-100 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-safe:opacity-0"
      >
        open ↗
      </span>
    </div>
    <p class="my-0 text-sm leading-6 text-slate-600">{{ comment }}</p>
  </a>
</template>
