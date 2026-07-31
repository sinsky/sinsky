<script setup lang="ts">
import { computed, type ButtonHTMLAttributes } from "vue";

interface Props {
  type?: ButtonHTMLAttributes["type"];
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "ghost";
}

const props = withDefaults(defineProps<Props>(), {
  type: "submit",
  variant: "primary",
});

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";
const variants = computed(() =>
  props.variant === "primary"
    ? "bg-violet-500 text-white shadow-md hover:bg-violet-600 hover:shadow-lg"
    : "bg-white/70 text-slate-700 hover:bg-white",
);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[base, variants]"
  >
    <span
      v-if="loading"
      class="inline-block size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
