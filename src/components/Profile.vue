<script setup lang="ts">
import LineMdGithubLoop from "~icons/line-md/github-loop?width=24px&height=24px";
import LineMdTwitterX from "~icons/line-md/twitter-x?width=24px&height=24px";
import SimpleIconsSimplex from "~icons/simple-icons/simplex?width=24px&height=24px";

import Reveal from "@/components/Reveal.vue";

defineProps<{ bgColor: string }>();

const socials = [
  {
    href: "https://github.com/sinsky",
    label: "GitHub",
    icon: LineMdGithubLoop,
  },
  {
    href: "https://x.com/sin_sky_",
    label: "Twitter",
    icon: LineMdTwitterX,
  },
  {
    href: "https://smp18.simplex.im/a#IOTvEo14cHLOksiXhEN3CR5CsvJoCVlXd5r5CFXaaeE",
    label: "SimpleX",
    icon: SimpleIconsSimplex,
  },
];

const intro = "セルフホストが好き。OSSへの貢献や個人開発を楽しんでいます。";
</script>

<template>
  <section
    id="profile"
    class="relative flex flex-col items-center gap-10 px-6 py-24 min-h-svh"
    :class="bgColor"
  >
    <h2 class="sr-only">Profile</h2>
    <Reveal :delay="120">
      <div
        class="flex flex-col items-center gap-5 px-8 py-10 shadow-sm bubble-shape bg-white/70 backdrop-blur-sm md:px-14"
        style="--bubble-duration: 16s"
      >
        <img
          src="https://github.com/sinsky.png"
          alt="sinsky"
          class="rounded-full shadow-md size-28 ring-4 ring-white"
          width="112"
          height="112"
        />
        <h3 class="text-2xl font-bold text-slate-800">sinsky</h3>
        <ul class="flex gap-6 mt-2">
          <li v-for="social in socials" :key="social.label">
            <a
              :href="social.href"
              :aria-label="social.label"
              target="_blank"
              rel="noopener noreferrer"
              class="transition-transform text-slate-600 hover:scale-110 hover:text-slate-900"
            >
              <component :is="social.icon" class="size-8" />
            </a>
          </li>
        </ul>
      </div>
    </Reveal>

    <Reveal>
      <p
        class="max-w-2xl text-sm leading-8 text-center text-slate-600 md:text-base md:leading-8"
      >
        {{ intro }}
      </p>
    </Reveal>
  </section>
</template>
