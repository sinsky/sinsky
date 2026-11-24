<script setup lang="ts">
import { computed, useId } from "vue";
import FormLabel from "./FormLabel.vue";
import FormTextarea from "./FormTextarea.vue";
import FormHint from "./FormHint.vue";
import FormError from "./FormError.vue";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  hint?: string;
  required?: boolean;
  modelValue: string;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), { rows: 5 });

defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "blur"): void;
}>();

const id = useId();
const hintId = `${id}-hint`;
const errorId = `${id}-error`;

const hasError = computed(() => !!props.error);
const describedBy = computed(() => {
  const ids: string[] = [];
  if (props.hint && !hasError.value) ids.push(hintId);
  if (hasError.value) ids.push(errorId);
  return ids.length > 0 ? ids.join(" ") : undefined;
});
</script>

<template>
  <div>
    <FormLabel :htmlFor="id" :required="required">{{ label }}</FormLabel>
    <FormTextarea
      :id="id"
      :name="name"
      :placeholder="placeholder"
      :rows="rows"
      :modelValue="modelValue"
      :describedBy="describedBy"
      :invalid="!!error"
      @update:modelValue="$emit('update:modelValue', $event)"
      @blur="$emit('blur')"
    />
    <FormHint v-if="hint && !error" :id="hintId">{{ hint }}</FormHint>
    <FormError v-if="error" :id="errorId">{{ error }}</FormError>
  </div>
</template>
