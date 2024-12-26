import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [vue(), VueRouter()],
});
