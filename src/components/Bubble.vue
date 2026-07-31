<script setup lang="ts">
defineProps<{
  color: string;
  label: string;
  description?: string;
  href: string;
}>();
</script>

<template>
  <a
    :href="href"
    class="bubble bubble-shape group relative flex flex-col items-center justify-center gap-1 px-6 text-center font-semibold text-slate-700 shadow-sm transition-transform duration-500 will-change-transform hover:scale-[1.04]"
    :class="color"
    style="--bubble-duration: 9s"
  >
    <span class="text-lg md:text-2xl">{{ label }}</span>
    <span v-if="description" class="text-xs font-normal opacity-70 md:text-sm">
      {{ description }}
    </span>
  </a>
</template>

<style scoped>
.bubble {
  width: clamp(9rem, 26vw, 15rem);
  height: clamp(9rem, 26vw, 15rem);
  box-shadow:
    0 12px 28px rgba(80, 80, 100, 0.08),
    inset 0 -6px 18px rgba(255, 255, 255, 0.5);
}
.bubble:nth-child(2) {
  --bubble-delay: -3s;
  --bubble-duration: 11s;
}
.bubble:nth-child(3) {
  --bubble-delay: -6s;
  --bubble-duration: 13s;
}
</style>
