/// <reference types="vitest" />

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { voidPlugin } from "void";
import { voidVue } from "@void/vue/plugin";
import vueDevTools from "vite-plugin-vue-devtools";
import Icons from "unplugin-icons/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [voidPlugin(), voidVue(), vueDevTools(), Icons(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
