<script setup lang="ts">
import { computed, useId, type InputHTMLAttributes } from "vue";

interface Props {
  modelValue?: string;
  type?: InputHTMLAttributes["type"];
  name?: string;
  autocomplete?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: "",
});

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const id = useId();
defineExpose({ id });
const inputId = computed(() => props.name ?? id);
</script>

<template>
  <input
    :id="inputId"
    :type="type"
    :name="name"
    :autocomplete="autocomplete"
    :placeholder="placeholder"
    :disabled="disabled"
    :aria-invalid="invalid || undefined"
    :aria-describedby="describedBy"
    :value="modelValue"
    @input="
      $emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
    class="block w-full rounded-xl border bg-white/95 px-4 py-2.5 text-base text-[var(--ink)] shadow-sm outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-300/60 disabled:cursor-not-allowed disabled:opacity-60"
    :class="
      invalid ? 'border-rose-300 focus:ring-rose-200' : 'border-violet-200'
    "
  />
</template>
