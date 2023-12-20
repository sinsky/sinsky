import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";

const outDir = "./dist";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      outDir,
      hostname: "https://sinsky.dev",
      generateRobotsTxt: true,
      dynamicRoutes: ["/work"],
    }),
  ],
  base: "./",
  build: {
    outDir,
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
