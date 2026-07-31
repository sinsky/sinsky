<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { toast } from "vue-sonner";

import Reveal from "@/components/Reveal.vue";
import FieldText from "@/components/form/FieldText.vue";
import FieldArea from "@/components/form/FieldArea.vue";
import FormButton from "@/components/form/FormButton.vue";

defineProps<{ bgColor: string }>();

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
const contactApiUrl = "/api/contact";

const formSchema = toTypedSchema(
  z.object({
    "bot-field": z.string().default(""),
    name: z.string().min(1, { message: "お名前を入力してください" }).max(50),
    email: z.string().email("有効なメールアドレスを入力してください"),
    message: z
      .string()
      .min(10, { message: "内容は最低10文字以上入力してください" })
      .max(5000, { message: "内容は5000文字以内で入力してください" }),
  }),
);

const { handleSubmit, isSubmitting, resetForm, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    "bot-field": "",
    name: "",
    email: "",
    message: "",
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await fetch(contactApiUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        "bot-field": values["bot-field"],
        name: values.name,
        email: values.email,
        message: values.message,
      }),
    });

    if (response.ok) {
      toast.success("送信完了", { description: "確認後、返答いたします。" });
      resetForm();
    } else {
      toast.error("送信エラー", {
        description: "お手数ですが、再度送信してください。",
      });
    }
  } catch (error) {
    console.error("フォーム送信エラー:", error);
    toast.error("送信エラー", {
      description: "お手数ですが、再度送信してください。",
    });
  }
});

function onBotField(event: Event) {
  setFieldValue("bot-field", (event.target as HTMLInputElement).value);
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
        <form @submit="onSubmit" class="flex flex-col gap-5" novalidate>
          <div hidden aria-hidden="true">
            <label for="bot-field">bot-field</label>
            <input
              id="bot-field"
              name="bot-field"
              type="text"
              tabindex="-1"
              autocomplete="off"
              @input="onBotField"
            />
          </div>

          <FieldText
            name="name"
            label="お名前"
            placeholder="sinsky"
            autocomplete="name"
            required
          />

          <FieldText
            name="email"
            label="メールアドレス"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            required
          />

          <FieldArea
            name="message"
            label="内容"
            placeholder="お問い合わせ内容を入力してください"
            :rows="6"
            required
          />

          <div class="mt-2 flex justify-end">
            <FormButton :loading="isSubmitting">
              <span>{{ isSubmitting ? "送信中..." : "送信" }}</span>
            </FormButton>
          </div>
        </form>
      </div>
    </Reveal>
  </section>
</template>
