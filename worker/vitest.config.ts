import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "../wrangler.jsonc" },
      miniflare: {
        bindings: {
          SLACK_WEBHOOK_URL:
            "https://hooks.slack.com/services/T0000000/B0000000/XXXXXXXXXXXXXXXXXXXXXXXX",
        },
      },
    }),
  ],
});
