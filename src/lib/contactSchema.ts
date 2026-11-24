import { z } from "zod";

export const contactSchema = z.object({
  "bot-field": z.string().default(""),
  name: z
    .string()
    .trim()
    .min(1, "お名前を入力してください")
    .max(100, "お名前は100文字以内で入力してください"),
  email: z
    .email("有効なメールアドレスを入力してください")
    .max(254, "メールアドレスが長すぎます"),
  message: z
    .string()
    .trim()
    .min(10, "内容は最低10文字以上入力してください")
    .max(5000, "内容は5000文字以内で入力してください"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
