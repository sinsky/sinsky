<script setup lang="ts">
import { useSeoMeta } from "@unhead/vue";

useSeoMeta({
  charset: "utf-8",
  title: "sinsky.me",
  description: "やっほー！sinskyのプロフィールページへようこそ！",
  ogImage: "https://github.com/sinsky.png",
  ogDescription: "やっほー！sinskyのプロフィールページへようこそ！",
  ogSiteName: "sinsky.me",
  ogType: "website",
  ogUrl: "https://sinsky.me",
  ogLocale: "ja",
  themeColor: "#cbd5e1",
});
import Top from "@/components/Top.vue";
import Skills from "@/components/Skills.vue";
</script>

<template>
  <Top bg-color="bg-slate-200 dark:bg-slate-800" />
  <Skills bg-color="bg-teal-200 dark:bg-teal-800" />
</template>
