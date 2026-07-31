<script setup lang="ts">
defineProps<{ bgColor: string }>();

import Reveal from "@/components/Reveal.vue";
import SkillChip from "@/components/blocks/SkillChip.vue";
import CategoryBlock from "@/components/blocks/CategoryBlock.vue";
import PrCard from "@/components/blocks/PrCard.vue";

import SimpleIconsTypescript from "~icons/simple-icons/typescript";
import SimpleIconsJavascript from "~icons/simple-icons/javascript";
import SimpleIconsPython from "~icons/simple-icons/python";
import SimpleIconsRust from "~icons/simple-icons/rust";
import SimpleIconsVuedotjs from "~icons/simple-icons/vuedotjs";
import SimpleIconsReact from "~icons/simple-icons/react";
import SimpleIconsNextdotjs from "~icons/simple-icons/nextdotjs";
import SimpleIconsVite from "~icons/simple-icons/vite";
import SimpleIconsDjango from "~icons/simple-icons/django";
import SimpleIconsTrpc from "~icons/simple-icons/trpc";
import SimpleIconsPrisma from "~icons/simple-icons/prisma";
import SimpleIconsDrizzle from "~icons/simple-icons/drizzle";
import SimpleIconsTailwindcss from "~icons/simple-icons/tailwindcss";
import SimpleIconsGithubactions from "~icons/simple-icons/githubactions";
import SimpleIconsDocker from "~icons/simple-icons/docker";
import SimpleIconsCloudflare from "~icons/simple-icons/cloudflare";
import SimpleIconsVercel from "~icons/simple-icons/vercel";
import SimpleIconsPlaywright from "~icons/simple-icons/playwright";

const languages = [
  { title: "TypeScript", icon: SimpleIconsTypescript },
  { title: "JavaScript", icon: SimpleIconsJavascript },
  { title: "Python", icon: SimpleIconsPython },
  { title: "Rust", icon: SimpleIconsRust },
];

const tools = [
  { title: "Vue.js", icon: SimpleIconsVuedotjs },
  { title: "React", icon: SimpleIconsReact },
  { title: "Next.js", icon: SimpleIconsNextdotjs },
  { title: "Vite", icon: SimpleIconsVite },
  { title: "Django", icon: SimpleIconsDjango },
  { title: "tRPC", icon: SimpleIconsTrpc },
  { title: "Prisma", icon: SimpleIconsPrisma },
  { title: "Drizzle", icon: SimpleIconsDrizzle },
  { title: "Tailwind CSS", icon: SimpleIconsTailwindcss },
  { title: "GitHub Actions", icon: SimpleIconsGithubactions },
  { title: "Docker", icon: SimpleIconsDocker },
  { title: "Cloudflare", icon: SimpleIconsCloudflare },
  { title: "Vercel", icon: SimpleIconsVercel },
  { title: "Playwright", icon: SimpleIconsPlaywright },
];

const certifications: string[] = [
  "Associate Cloud Engineer - Google Cloud",
  "Azure AI Fundamentals – Microsoft",
  "Certified System Administrator – ServiceNow",
];

const featuredPullRequests = [
  {
    title: "raycast/extensions#create-link",
    url: "https://www.raycast.com/sinsky/create-link",
    comment:
      "Raycastの拡張機能で、ブラウザで開いているページのリンクを簡単に作成できる拡張機能を公開しています。",
  },
  {
    title: "asciimoo/hister#73",
    url: "https://github.com/asciimoo/hister/pull/73",
    comment:
      "1GBを超えるDockerイメージの配布だったため、distrolessベースのリリース(50MB程度)の提案、マージされています。",
  },
  {
    title: "DefinitelyTyped/DefinitelyTyped#71186",
    url: "https://github.com/DefinitelyTyped/DefinitelyTyped/pull/71186",
    comment:
      "GASを業務で使うことが多いのですが、不足していた型定義を追加するPRを提出し、マージされました。",
  },
  {
    title: "translate/codeberg",
    url: "https://translate.codeberg.org/user/sinsky/",
    comment:
      "Codebergの翻訳プラットフォームで、主にForgejoの翻訳に貢献しています。",
  },
];
</script>

<template>
  <section
    id="skills"
    class="relative flex flex-col items-center gap-10 px-6 py-24 min-h-svh"
    :class="bgColor"
  >
    <h2 class="text-center text-slate-800">Skills</h2>
    <p class="max-w-md text-sm text-center text-slate-600">
      日々使っている言語・ツールと、ピックアップしたPull Requestを並べています。
    </p>

    <div class="flex flex-col w-full max-w-4xl gap-10">
      <Reveal>
        <CategoryBlock title="Languages" description="日々書いている主言語">
          <SkillChip
            v-for="item in languages"
            :key="item.title"
            :title="item.title"
          >
            <component :is="item.icon" />
          </SkillChip>
        </CategoryBlock>
      </Reveal>

      <Reveal :delay="80">
        <CategoryBlock
          title="Frameworks & Tools"
          description="よく使うフレームワーク・ツール"
        >
          <SkillChip
            v-for="item in tools"
            :key="item.title"
            :title="item.title"
          >
            <component :is="item.icon" />
          </SkillChip>
        </CategoryBlock>
      </Reveal>

      <Reveal :delay="160">
        <CategoryBlock title="Certifications" description="保有資格">
          <span
            v-for="cert in certifications"
            :key="cert"
            class="rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-emerald-900 shadow-sm"
          >
            {{ cert }}
          </span>
        </CategoryBlock>
      </Reveal>

      <Reveal :delay="240">
        <section class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <h3 class="my-0 text-lg font-semibold text-emerald-900">
              活動のピックアップ
            </h3>
            <p class="text-sm text-emerald-700/80">
              PRなどいくつか紹介したいものを取り上げます
            </p>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PrCard
              v-for="pr in featuredPullRequests"
              :key="pr.title"
              :title="pr.title"
              :url="pr.url"
              :comment="pr.comment"
            />
          </div>
        </section>
      </Reveal>
    </div>
  </section>
</template>
