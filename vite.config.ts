import { defineConfig } from "vite";
import Pages from "vite-plugin-pages";
import generateSitemap from "vite-plugin-pages-sitemap";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Pages({ onRoutesGenerated: (routes) => generateSitemap({ routes }) }),
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
