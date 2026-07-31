<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <p v-if="$slots.default" :id="id" class="mt-1.5 text-sm text-slate-500">
    <slot />
  </p>
</template>
