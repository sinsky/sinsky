import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    pool: "@cloudflare/vitest-pool-workers",
    poolOptions: {
      workers: {
        wrangler: { configPath: "../wrangler.jsonc" },
        miniflare: {
          bindings: {
            SLACK_WEBHOOK_URL:
              "https://hooks.slack.com/services/T0000000/B0000000/XXXXXXXXXXXXXXXXXXXXXXXX",
          },
        },
      },
    },
  },
});
