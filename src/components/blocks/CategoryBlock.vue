<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <h3 class="my-0 text-lg font-semibold text-emerald-900">{{ title }}</h3>
      <p v-if="description" class="text-sm text-emerald-700/80">
        {{ description }}
      </p>
    </div>
    <div class="flex flex-wrap gap-3">
      <slot />
    </div>
  </section>
</template>
