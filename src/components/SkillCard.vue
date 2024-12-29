<script setup lang="ts">
defineProps<{ title: string }>();
</script>
<template>
  <div class="flex flex-col items-center gap-2">
    <slot></slot>
    <p class="!mt-0 text-sm">{{ title }}</p>
  </div>
</template>
