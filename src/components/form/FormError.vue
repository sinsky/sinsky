<script setup lang="ts">
defineProps<{ id?: string }>();
</script>

<template>
  <p
    v-if="$slots.default"
    :id="id"
    role="alert"
    class="mt-1.5 text-sm text-rose-600"
  >
    <slot />
  </p>
</template>
