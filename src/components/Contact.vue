<script setup lang="ts">
import { useForm } from "@void/vue";
import { toast } from "vue-sonner";

import Reveal from "@/components/Reveal.vue";
import FieldText from "@/components/form/FieldText.vue";
import FieldArea from "@/components/form/FieldArea.vue";
import FormButton from "@/components/form/FormButton.vue";
import { contactSchema } from "@/lib/contactSchema";

defineProps<{ bgColor: string }>();

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;

const form = useForm(
  "/",
  { "bot-field": "", name: "", email: "", message: "" },
  { resetOnSuccess: true },
);

async function onSubmit() {
  const parsed = contactSchema.safeParse(form.data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      form.setError(
        issue.path[0] as "bot-field" | "name" | "email" | "message",
        issue.message,
      );
    }
    return;
  }
  try {
    await form.post();
    if (form.wasSuccessful) {
      toast.success("送信完了", { description: "確認後、返答いたします。" });
    }
  } catch {
    toast.error("送信エラー", {
      description: "お手数ですが、再度送信してください。",
    });
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
              v-model="form.data['bot-field']"
              name="bot-field"
              type="text"
              tabindex="-1"
              autocomplete="off"
            />
          </div>

          <FieldText
            v-model="form.data.name"
            :error="form.errors.name"
            name="name"
            label="お名前"
            placeholder="sinsky"
            autocomplete="name"
            required
          />

          <FieldText
            v-model="form.data.email"
            :error="form.errors.email"
            name="email"
            label="メールアドレス"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
          />

          <FieldArea
            v-model="form.data.message"
            :error="form.errors.message"
            name="message"
            label="内容"
            placeholder="お問い合わせ内容を入力してください"
            :rows="6"
            required
          />

          <div class="mt-2 flex justify-end">
            <FormButton :loading="form.pending">
              <span>{{ form.pending ? "送信中..." : "送信" }}</span>
            </FormButton>
          </div>
        </form>
      </div>
    </Reveal>
  </section>
</template>
