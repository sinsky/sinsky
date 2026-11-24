<script setup lang="ts">
import { reactive, ref } from "vue";

import Reveal from "@/components/Reveal.vue";
import FieldText from "@/components/form/FieldText.vue";
import FieldArea from "@/components/form/FieldArea.vue";
import FormButton from "@/components/form/FormButton.vue";
import ContactResultModal from "@/components/ContactResultModal.vue";
import { contactSchema, fieldError } from "@/lib/contactSchema";
import type { ContactField } from "@/lib/contactSchema";

defineProps<{ bgColor: string }>();

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
const contactApiUrl = "/api/contact";

const fields = reactive({
  "bot-field": "",
  name: "",
  email: "",
  message: "",
});

const errors = reactive<{ name?: string; email?: string; message?: string }>(
  {},
);

const pending = ref(false);
const result = ref<"success" | "error" | null>(null);

async function onSubmit() {
  const parsed = contactSchema.safeParse(fields);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField | "bot-field";
      if (field !== "bot-field") {
        errors[field] = issue.message;
      }
    }
    return;
  }
  pending.value = true;
  try {
    const response = await fetch(contactApiUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (response.ok) {
      result.value = "success";
      fields.name = "";
      fields.email = "";
      fields.message = "";
      fields["bot-field"] = "";
    } else {
      result.value = "error";
    }
  } catch (error) {
    console.error("フォーム送信エラー:", error);
    result.value = "error";
  } finally {
    pending.value = false;
  }
}

function onFieldBlur(field: ContactField) {
  const error = fieldError(field, fields[field]);
  if (error) {
    errors[field] = error;
  }
}
</script>

<template>
  <section
    id="contact"
    class="relative flex min-h-svh flex-col items-center gap-10 px-6 py-24"
    :class="bgColor"
  >
    <h2 class="text-center text-slate-800">Contact</h2>
    <p class="max-w-md text-center text-sm text-slate-600">
      お気軽にご連絡ください。
      <span v-if="contactEmail">
        フォームが使えないときは
        <a
          :href="`mailto:${contactEmail}`"
          class="font-medium text-violet-600 underline"
          >{{ contactEmail }}</a
        >
        まで。
      </span>
    </p>

    <Reveal class="w-full max-w-xl" :delay="100">
      <div
        class="bubble-shape w-full bg-white/85 p-8 shadow-sm backdrop-blur-sm md:p-12"
        style="--bubble-duration: 16s"
      >
        <form @submit.prevent="onSubmit" class="flex flex-col gap-5" novalidate>
          <div hidden aria-hidden="true">
            <label for="bot-field">bot-field</label>
            <input
              id="bot-field"
              v-model="fields['bot-field']"
              name="bot-field"
              type="text"
              tabindex="-1"
              autocomplete="off"
            />
          </div>

          <FieldText
            v-model="fields.name"
            :error="errors.name"
            name="name"
            label="お名前"
            placeholder="sinsky"
            autocomplete="name"
            required
            @blur="onFieldBlur('name')"
          />

          <FieldText
            v-model="fields.email"
            :error="errors.email"
            name="email"
            label="メールアドレス"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
            @blur="onFieldBlur('email')"
          />

          <FieldArea
            v-model="fields.message"
            :error="errors.message"
            name="message"
            label="内容"
            placeholder="お問い合わせ内容を入力してください"
            :rows="6"
            required
            @blur="onFieldBlur('message')"
          />

          <div class="mt-2 flex justify-end">
            <FormButton :loading="pending">
              <span>{{ pending ? "送信中..." : "送信" }}</span>
            </FormButton>
          </div>
        </form>
      </div>
    </Reveal>

    <ContactResultModal
      v-if="result !== null"
      :type="result"
      @close="result = null"
    />
  </section>
</template>
