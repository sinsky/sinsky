<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <span
    class="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-emerald-900 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow"
  >
    <span class="inline-flex size-5 items-center justify-center [&>svg]:size-5">
      <slot />
    </span>
    {{ title }}
  </span>
</template>
