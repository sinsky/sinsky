<script setup lang="ts">
defineProps<{ bgColor: string }>();
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;

const formSchema = toTypedSchema(
  z.object({
    "bot-field": z.string().default(""),
    "form-name": z.string().default("Contact"),
    name: z.string().min(1, { message: "お名前を入力してください" }).max(50),
    email: z.string().email("有効なメールアドレスを入力してください"),
    description: z
      .string()
      .min(10, { message: "内容は最低10文字以上入力してください" }),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const { isSubmitting } = form;

const onSubmit = form.handleSubmit((values) => {
  try {
    const formData = new URLSearchParams(
      values as Record<string, string>,
    ).toString();
    console.log(formData);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    }).then((res) => {
      if (res.status === 200) {
        toast.success("送信完了", {
          description: "確認後、返答いたします。",
        });
        form.resetForm();
      } else {
        toast.error("送信エラー", {
          description: "お手数ですが、再度送信してください。",
        });
      }
    });
  } catch (error) {
    console.error("フォーム送信エラー:", error);
    toast.error("送信エラー", {
      description: "お手数ですが、再度送信してください。",
    });
  }
});
</script>

<template>
  <section class="relative z-30 py-16" :class="bgColor">
    <h2 class="text-center">Contact</h2>
    <div class="container max-w-lg mx-auto">
      <form
        @submit="onSubmit"
        class="[&>*:not(:last-child)]:mb-8"
        netlify
        netlify-honeypot="bot-field"
        name="Contact"
      >
        <FormField v-slot="{ componentField }" name="form-name">
          <Input type="hidden" v-bind="componentField" value="Contact" />
        </FormField>
        <div hidden>
          <FormField v-slot="{ componentField }" name="bot-field">
            <FormLabel>bot-field</FormLabel>
            <Input type="hidden" v-bind="componentField" />
            <FormDescription
              >あなたが人間なら、これを記入しないでください</FormDescription
            >
          </FormField>
        </div>
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>お名前</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="sinsky"
                v-bind="componentField"
                class="border-slate-700"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>メールアドレス</FormLabel>
            <FormControl>
              <Input
                type="email"
                :placeholder="contactEmail"
                v-bind="componentField"
                class="border-slate-700"
              />
            </FormControl>
            <FormDescription>連絡先を入力してください</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>内容</FormLabel>
            <FormControl>
              <Textarea
                placeholder="shadcn"
                v-bind="componentField"
                rows="4"
                class="border-slate-700"
              />
            </FormControl>
            <FormDescription>
              お問い合わせ内容を入力してください
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="flex justify-end">
          <Button type="submit" :disabled="isSubmitting">
            <span v-if="isSubmitting">送信中...</span>
            <span v-else>送信</span>
          </Button>
        </div>
      </form>
    </div>
  </section>
</template>
