import z from "zod";

export const createContactSchema = z.object({
  replyEmail: z.string().email("有効なメールアドレスを指定してください"),
  subject: z
    .string()
    .min(1, "最低1文字以上の入力が必要です")
    .max(100, "最大100文字までの入力となります"),
  body: z
    .string()
    .min(5, "最低5文字以上の入力が必要です")
    .max(500, "最大500文字までの入力となります"),
});

export type CreateContactSchema = z.TypeOf<typeof createContactSchema>;

export const getContactSchema = z.object({
  cuid: z.string().cuid("不正な値です"),
});
