import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      outDir: "./docs",
      hostname: "https://sinsky.dev",
      generateRobotsTxt: true,
    }),
  ],
  base: "./",
  build: {
    outDir: "./docs",
    rollupOptions: {
      output: {
        // assetFileNames: "[name][extname]",
        // entryFileNames: "[name].js",
      },
    },
    emptyOutDir: false,
  },
  define: {
    global: "window",
  },
});
