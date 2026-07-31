<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
import Bubble from "@/components/Bubble.vue";
</script>

<template>
  <section
    class="relative flex h-[100svh] flex-col items-center justify-center gap-10 bg-gradient-to-b from-pink-50 via-sky-50 to-violet-50 px-6"
  >
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-slate-800">sinsky</h1>
    </div>

    <nav class="flex flex-wrap items-center justify-center gap-6 md:gap-10">
      <Bubble
        color="bg-pink-200"
        label="Profile"
        description="about me"
        href="#profile"
      />
      <Bubble
        color="bg-emerald-200"
        label="Skills"
        description="stack & PRs"
        href="#skills"
      />
      <Bubble
        color="bg-violet-200"
        label="Contact"
        description="say hi"
        href="#contact"
      />
    </nav>

    <a
      href="#profile"
      aria-label="Profile セクションへスクロール"
      class="absolute flex flex-col items-center gap-2 transition-colors bottom-8 text-slate-400 hover:text-slate-600"
    >
      <span class="text-xs font-medium tracking-[0.2em] uppercase">scroll</span>
      <span
        class="flex items-center justify-center rounded-full shadow-sm size-9 bg-white/70 backdrop-blur-sm motion-safe:animate-bounce"
      >
        <ChevronDown class="size-4" />
      </span>
    </a>
  </section>
</template>
