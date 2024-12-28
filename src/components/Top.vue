<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LineMdGithubLoop from "~icons/line-md/github-loop?width=24px&height=24px";
import LineMdTwitterX from "~icons/line-md/twitter-x?width=24px&height=24px";

defineProps<{ bgColor: string }>();

// import { orange } from "tailwindcss/colors";
// const orange700 = orange["700"];
const hoverDropShadowOrange700 = `hover:drop-shadow-[0_0_.3rem_#c2410c]`;
</script>

<template>
  <section class="relative z-10 flex flex-col h-[80svh] frame" :class="bgColor">
    <div class="flex flex-col items-center justify-center flex-1">
      <Avatar size="lg">
        <AvatarImage src="https://github.com/sinsky.png" alt="@sinsky" />
        <AvatarFallback>SS</AvatarFallback>
      </Avatar>
      <h1 class="text-3xl font-bold">sinsky</h1>
    </div>
    <div class="flex flex-col items-center justify-center w-full gap-4 mb-8">
      <h2 class="text-2xl font-bold">Social Media</h2>
      <ul class="flex gap-4">
        <li>
          <a href="https://github.com/sinsky"
            ><LineMdGithubLoop
              class="transition-all size-8 will-change-auto"
              :class="hoverDropShadowOrange700"
          /></a>
        </li>
        <li>
          <a href="https://x.com/sin_sky_"
            ><LineMdTwitterX
              class="transition-all size-8 will-change-auto"
              :class="hoverDropShadowOrange700"
          /></a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
@supports (animation-timeline: scroll()) {
  .frame {
    animation: delay linear forwards;
    animation-timeline: scroll();
  }
  @keyframes delay {
    0% {
      transform: translateY(0px);
    }

    100% {
      transform: translateY(50%);
    }
  }
}
@supports not (animation-timeline: scroll()) {
  .frame {
    padding: 4rem 0;
  }
}
</style>
