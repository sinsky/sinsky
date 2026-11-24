import { defineConfig } from "void/config";

export default defineConfig({
  output: "static",
  routing: {
    typedRoutes: true,
    // 1つでもedge ruleがあるとCloudflareのrun_worker_firstがtrue（全リクエストWorker経由）
    // になり、静的prerenderページ上のaction（フォーム送信）が本番で機能する。
    // このヘッダー自体も標準的なセキュリティハードニング。
    headers: {
      "/*": ["X-Content-Type-Options: nosniff"],
    },
  },
  // 既存の "sinsky" Worker を void deploy の対象として引き継ぐ
  // （dashboard管理のドメイン/visibility設定を明示宣言してトラフィックを保存）
  cloudflare: {
    name: "sinsky",
    routes: [{ pattern: "sinsky.me", custom_domain: true }],
    workers_dev: true,
    preview_urls: true,
  },
  head: {
    htmlAttrs: { lang: "ja" },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "theme-color", content: "#fbcfe8" },
    ],
    link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
  },
});
