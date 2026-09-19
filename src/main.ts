import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { routes } from "vue-router/auto-routes";
import "./assets/index.css";

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, head }) => {
    // vite-ssg v28 が内部で作成する @unhead/vue v2 の head インスタンスに
    // アプリ側の @unhead/vue v3 の useSeoMeta からも接続できるよう、
    // Vue アプリインスタンスに head を明示的に注入する。
    // （v3 では useSeoMeta が app._context 経由で head を解決するため）
    if (head) {
      app.use(head);
    }
  },
  { useHead: true },
);
