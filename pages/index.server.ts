import { defineHandler, defineHead } from "void";
import { env } from "void/env";
import { contactSchema } from "@/lib/contactSchema";
import { submitContact } from "@/lib/contactSubmit";

export const head = defineHead(() => ({
  title: "sinsky.me",
  titleTemplate: "",
  meta: [
    {
      name: "description",
      content: "sinskyのプロフィールページへようこそ！",
    },
    {
      property: "og:description",
      content: "sinskyのプロフィールページへようこそ！",
    },
    { property: "og:image", content: "https://github.com/sinsky.png" },
    { property: "og:site_name", content: "sinsky.me" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://sinsky.me" },
    { property: "og:locale", content: "ja" },
  ],
}));

export const action = defineHandler.withValidator({ body: contactSchema })(
  async (c, { body }) => {
    const result = await submitContact(body, env.SLACK_WEBHOOK_URL);
    if (!result.ok) {
      return c.text(result.message, result.status);
    }
  },
);
