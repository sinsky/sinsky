<script setup lang="ts">
import { computed, useId, type TextareaHTMLAttributes } from "vue";

interface Props {
  modelValue?: string;
  name?: string;
  autocomplete?: string;
  placeholder?: string;
  rows?: TextareaHTMLAttributes["rows"];
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  rows: 5,
});

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const id = useId();
defineExpose({ id });
const inputId = computed(() => props.name ?? id);
</script>

<template>
  <textarea
    :id="inputId"
    :name="name"
    :autocomplete="autocomplete"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedBy"
    :value="modelValue"
    @input="
      $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
    "
    class="block w-full resize-y rounded-2xl border bg-white/95 px-4 py-3 text-base text-[var(--ink)] shadow-sm outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-300/60 disabled:cursor-not-allowed disabled:opacity-60"
    :class="
      invalid ? 'border-rose-300 focus:ring-rose-200' : 'border-violet-200'
    "
  />
</template>
