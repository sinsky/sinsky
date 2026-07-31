/// <reference types="@cloudflare/workers-types" />

// Augment the wrangler-generated Env with secrets set via `wrangler secret put`.
declare global {
  interface Env {
    SLACK_WEBHOOK_URL: string;
  }
}

export {};
