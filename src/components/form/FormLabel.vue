<script setup lang="ts">
defineProps<{ htmlFor?: string; required?: boolean }>();
</script>

<template>
  <label :for="htmlFor" class="mb-1.5 block font-medium text-[var(--ink)]">
    <slot />
    <span v-if="required" aria-hidden="true" class="text-violet-600">*</span>
  </label>
</template>
