<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(defineProps<{ delay?: number }>(), { delay: 0 });

const el = ref<HTMLElement | null>(null);
// `armed` applies the hidden initial state only on the client, so the
// prerendered (SSG / no-JS) HTML always stays visible.
const armed = ref(false);
const shown = ref(false);
let observer: IntersectionObserver | undefined;

onMounted(() => {
  if (!el.value) return;
  if (typeof IntersectionObserver === "undefined") {
    shown.value = true;
    return;
  }
  armed.value = true;
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        shown.value = true;
        observer?.disconnect();
      }
    },
    { threshold: 0.12 },
  );
  observer.observe(el.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div
    ref="el"
    class="reveal"
    :class="{ armed, 'is-visible': shown }"
    :style="props.delay ? { transitionDelay: `${props.delay}ms` } : undefined"
  >
    <slot />
  </div>
</template>

<style scoped>
.reveal {
  transition:
    opacity 0.7s ease-out,
    transform 0.7s ease-out;
}
.reveal.armed {
  opacity: 0;
  transform: translateY(1.25rem);
}
.reveal.armed.is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    transition: none;
  }
  .reveal.armed {
    opacity: 1;
    transform: none;
  }
}
</style>
