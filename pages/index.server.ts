import { defineHead } from "void";

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
