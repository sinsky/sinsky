<script setup lang="ts">
import { useField } from "vee-validate";
import { computed, useId } from "vue";
import FormLabel from "./FormLabel.vue";
import FormInput from "./FormInput.vue";
import FormHint from "./FormHint.vue";
import FormError from "./FormError.vue";

interface Props {
  name: string;
  label: string;
  type?: "text" | "email";
  placeholder?: string;
  autocomplete?: string;
  hint?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
});

const id = useId();
const hintId = `${id}-hint`;
const errorId = `${id}-error`;
const { value, errorMessage, handleBlur, handleChange, meta } =
  useField<string>(props.name, undefined, { validateOnValueUpdate: false });

const hasError = computed(() => !!errorMessage.value && meta.touched);
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
    <FormInput
      :id="id"
      :name="name"
      :type="type"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :modelValue="(value as string) ?? ''"
      :describedBy="describedBy"
      :invalid="!!errorMessage && meta.touched"
      @update:modelValue="handleChange"
      @blur="handleBlur"
    />
    <FormHint v-if="hint && !errorMessage" :id="hintId">{{ hint }}</FormHint>
    <FormError v-if="errorMessage && meta.touched" :id="errorId">{{
      errorMessage
    }}</FormError>
  </div>
</template>
