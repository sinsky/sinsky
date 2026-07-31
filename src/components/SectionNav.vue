<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useWindowScroll, useWindowSize } from "@vueuse/core";

const links = [
  {
    id: "profile",
    label: "Profile",
    dot: "bg-pink-300",
    ring: "ring-pink-400",
  },
  {
    id: "skills",
    label: "Skills",
    dot: "bg-emerald-300",
    ring: "ring-emerald-400",
  },
  {
    id: "contact",
    label: "Contact",
    dot: "bg-violet-300",
    ring: "ring-violet-400",
  },
];

const activeId = ref<string | null>(null);

const { y } = useWindowScroll();
const { height } = useWindowSize();
const showNav = computed(() => y.value > height.value * 0.6);

let observer: IntersectionObserver | undefined;

onMounted(() => {
  if (typeof IntersectionObserver === "undefined") return;
  // The middle 10% band of the viewport decides which section is "current".
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id;
        }
      }
    },
    { rootMargin: "-45% 0px -45% 0px" },
  );
  for (const link of links) {
    const el = document.getElementById(link.id);
    if (el) observer.observe(el);
  }
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <nav
    aria-label="セクションナビゲーション"
    class="fixed top-1/2 right-4 z-40 -translate-y-1/2 transition-all duration-500"
    :class="
      showNav ? 'opacity-100' : 'pointer-events-none translate-x-3 opacity-0'
    "
  >
    <ul class="flex flex-col gap-3">
      <li v-for="link in links" :key="link.id">
        <a
          :href="`#${link.id}`"
          :aria-label="link.label"
          :aria-current="activeId === link.id ? 'location' : undefined"
          class="group flex items-center justify-end gap-2"
        >
          <span
            class="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-600 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100"
          >
            {{ link.label }}
          </span>
          <span
            class="block size-3 rounded-full shadow-sm ring-2 transition-all duration-300"
            :class="[
              link.dot,
              activeId === link.id
                ? `scale-125 ${link.ring}`
                : 'ring-white/80 group-hover:scale-110',
            ]"
          />
        </a>
      </li>
    </ul>
  </nav>
</template>
