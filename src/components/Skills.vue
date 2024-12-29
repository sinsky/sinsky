<script setup lang="ts">
defineProps<{ bgColor: string }>();

import SkillCard from "./SkillCard.vue";

import SimpleIconsJavascript from "~icons/simple-icons/javascript?width=24px&height=24px";
import SimpleIconsTypescript from "~icons/simple-icons/typescript?width=24px&height=24px";
import SimpleIconsPython from "~icons/simple-icons/python?width=24px&height=24px";
import SimpleIconsRust from "~icons/simple-icons/rust?width=24px&height=24px";

import SimpleIconsVite from "~icons/simple-icons/vite?width=24px&height=24px";
import SimpleIconsReact from "~icons/simple-icons/react?width=24px&height=24px";
import SimpleIconsNextdotjs from "~icons/simple-icons/nextdotjs?width=24px&height=24px";
import SimpleIconsVuedotjs from "~icons/simple-icons/vuedotjs?width=24px&height=24px";
import SimpleIconsDjango from "~icons/simple-icons/django?width=24px&height=24px";
import SimpleIconsTrpc from "~icons/simple-icons/trpc?width=24px&height=24px";
import SimpleIconsPrisma from "~icons/simple-icons/prisma?width=24px&height=24px";
import SimpleIconsDrizzle from "~icons/simple-icons/drizzle?width=24px&height=24px";
import SimpleIconsJest from "~icons/simple-icons/jest?width=24px&height=24px";
import SimpleIconsPlaywright from "~icons/simple-icons/playwright?width=24px&height=24px";
import SimpleIconsShadcnui from "~icons/simple-icons/shadcnui?width=24px&height=24px";
import SimpleIconsMantine from "~icons/simple-icons/mantine?width=24px&height=24px";
import SimpleIconsTailwindcss from "~icons/simple-icons/tailwindcss?width=24px&height=24px";

import SimpleIconsGithub from "~icons/simple-icons/github?width=24px&height=24px";
import SimpleIconsGithubactions from "~icons/simple-icons/githubactions?width=24px&height=24px";
import SimpleIconsDocker from "~icons/simple-icons/docker?width=24px&height=24px";
import SimpleIconsGooglecloud from "~icons/simple-icons/googlecloud?width=24px&height=24px";
import SimpleIconsVercel from "~icons/simple-icons/vercel?width=24px&height=24px";
import SimpleIconsCloudflare from "~icons/simple-icons/cloudflare?width=24px&height=24px";
import SimpleIconsNetlify from "~icons/simple-icons/netlify?width=24px&height=24px";
import SimpleIconsSupabase from "~icons/simple-icons/supabase?width=24px&height=24px";

import SimpleIconsPowerbi from "~icons/simple-icons/powerbi?width=24px&height=24px";

const iconSize = "size-8";
</script>

<template>
  <section class="relative z-20 py-16 min-h-svh" :class="bgColor">
    <div class="flex flex-col items-center justify-center">
      <h2>Skills</h2>
      <h3 class="my-4">Programming Languages</h3>
      <div class="grid items-center grid-cols-4 gap-4">
        <SkillCard title="Javascript">
          <SimpleIconsJavascript :class="iconSize" />
        </SkillCard>
        <SkillCard title="Typescript">
          <SimpleIconsTypescript :class="iconSize" />
        </SkillCard>
        <SkillCard title="Python">
          <SimpleIconsPython :class="iconSize" />
        </SkillCard>
        <SkillCard title="Rust">
          <SimpleIconsRust :class="iconSize" />
        </SkillCard>
      </div>
      <h3 class="my-4">Frameworks & Libraries</h3>
      <div class="grid items-center grid-cols-4 gap-4 md:grid-cols-6">
        <SkillCard title="Vite">
          <SimpleIconsVite :class="iconSize" />
        </SkillCard>
        <SkillCard title="React">
          <SimpleIconsReact :class="iconSize" />
        </SkillCard>
        <SkillCard title="Next.js">
          <SimpleIconsNextdotjs :class="iconSize" />
        </SkillCard>
        <SkillCard title="Vue.js">
          <SimpleIconsVuedotjs :class="iconSize" />
        </SkillCard>
        <SkillCard title="Django">
          <SimpleIconsDjango :class="iconSize" />
        </SkillCard>
        <SkillCard title="tRPC">
          <SimpleIconsTrpc :class="iconSize" />
        </SkillCard>
        <SkillCard title="Prisma">
          <SimpleIconsPrisma :class="iconSize" />
        </SkillCard>
        <SkillCard title="Drizzle">
          <SimpleIconsDrizzle :class="iconSize" />
        </SkillCard>
        <SkillCard title="Jest">
          <SimpleIconsJest :class="iconSize" />
        </SkillCard>
        <SkillCard title="Playwright">
          <SimpleIconsPlaywright :class="iconSize" />
        </SkillCard>
        <SkillCard title="Tailwind CSS">
          <SimpleIconsTailwindcss :class="iconSize" />
        </SkillCard>
        <SkillCard title="Mantine UI">
          <SimpleIconsMantine :class="iconSize" />
        </SkillCard>
        <SkillCard title="Shadcn UI">
          <SimpleIconsShadcnui :class="iconSize" />
        </SkillCard>
      </div>
      <h3 class="my-4">Platforms & Services</h3>
      <div class="grid items-center grid-cols-4 gap-4 md:grid-cols-6">
        <SkillCard title="Github">
          <SimpleIconsGithub :class="iconSize" />
        </SkillCard>
        <SkillCard title="Github Actions">
          <SimpleIconsGithubactions :class="iconSize" />
        </SkillCard>
        <SkillCard title="Docker">
          <SimpleIconsDocker :class="iconSize" />
        </SkillCard>
        <SkillCard title="Google Cloud">
          <SimpleIconsGooglecloud :class="iconSize" />
        </SkillCard>
        <SkillCard title="Vercel">
          <SimpleIconsVercel :class="iconSize" />
        </SkillCard>
        <SkillCard title="Cloudflare">
          <SimpleIconsCloudflare :class="iconSize" />
        </SkillCard>
        <SkillCard title="Netlify">
          <SimpleIconsNetlify :class="iconSize" />
        </SkillCard>
        <SkillCard title="Supabase">
          <SimpleIconsSupabase :class="iconSize" />
        </SkillCard>
      </div>
      <h3 class="my-4">SaaS</h3>
      <div class="grid items-center grid-cols-2 gap-4">
        <SkillCard title="Power BI">
          <SimpleIconsPowerbi :class="iconSize" />
        </SkillCard>
        <SkillCard title="ServiceNow">
          <img
            src="/sn-logo-white.webp"
            alt="ServiceNow"
            class="h-8 pointer-events-none select-none"
          />
        </SkillCard>
      </div>
    </div>
  </section>
</template>
