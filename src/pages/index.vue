<script setup lang="ts">
import { useSeoMeta } from "@unhead/vue";

useSeoMeta({
  charset: "utf-8",
  title: "sinsky.me",
  description: "sinskyのプロフィールページへようこそ！",
  ogImage: "https://github.com/sinsky.png",
  ogDescription: "sinskyのプロフィールページへようこそ！",
  ogSiteName: "sinsky.me",
  ogType: "website",
  ogUrl: "https://sinsky.me",
  ogLocale: "ja",
  themeColor: "#fbcfe8",
});
import Hero from "@/components/Hero.vue";
import Profile from "@/components/Profile.vue";
import Skills from "@/components/Skills.vue";
import Contact from "@/components/Contact.vue";
import SectionNav from "@/components/SectionNav.vue";
</script>

<template>
  <main>
    <Hero />
    <Profile bg-color="bg-pink-100" />
    <Skills bg-color="bg-emerald-50" />
    <Contact bg-color="bg-violet-100" />
    <SectionNav />
  </main>
</template>
