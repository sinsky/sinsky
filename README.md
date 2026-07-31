# sinisky.me portfolio

Single-page portfolio served by a single Cloudflare Worker using **Workers Static Assets**. The Worker serves the built SPA from `dist/` and handles `POST /api/contact` by forwarding the message to a Slack Incoming Webhook.

## Architecture

```
Cloudflare Worker "sinsky"
├─ assets.directory  -> ../dist   (SPA built with vite-ssg)
├─ run_worker_first   -> ["/api/*"]
└─ src/worker.ts      -> POST /api/contact  ->  Slack Incoming Webhook
```

- Frontend: Vue 3 + vite-ssg + Tailwind CSS v4
- Hero: three Fancy-Border-Radius fluid bubbles linking to Profile / Skills / Contact
- Package manager: pnpm (managed via [mise](https://mise.jdx.dev/), workspaces via `pnpm-workspace.yaml`)

## Local development

```sh
mise install

# frontend
pnpm run dev

# worker (separate terminal)
cd worker
cp .dev.vars.example .dev.vars       # optional: set SLACK_WEBHOOK_URL
pnpm run dev
```

The Worker dev server proxies `../dist`, so build the frontend first (`pnpm run build`) if you want to preview the SPA through the Worker.

## Type generation

After editing `worker/wrangler.jsonc`, regenerate `worker/worker-configuration.d.ts`:

```sh
cd worker
pnpm run types        # wrangler types
```

Secrets (like `SLACK_WEBHOOK_URL`) are not in the generated `Env`. They are augmented in `worker/src/worker.d.ts`.

## Deploy

Single Worker + Assets deploy (after the frontend is built):

```sh
pnpm run build
cd worker
pnpm run deploy      # wrangler deploy  (uploads ../dist as assets + worker code)
```

Set the secret on first deploy:

```sh
cd worker
pnpm exec wrangler secret put SLACK_WEBHOOK_URL
```

Map the Worker to `sinsky.me` in the Cloudflare dashboard (Workers & Pages → sinisky → Settings → Domains & Routes). No separate Pages project or `api.sinsky.me` Worker is needed.

## Environment

| Variable             | Where                                 | Example                       |
| -------------------- | ------------------------------------- | ----------------------------- |
| `VITE_CONTACT_EMAIL` | frontend `.env`                       | `contact@sinsky.me`           |
| `CONTACT_TO_EMAIL`   | `worker/wrangler.jsonc` `vars`        | `contact@sinsky.me`           |
| `SLACK_WEBHOOK_URL`  | Worker secret (`wrangler secret put`) | `https://hooks.slack.com/...` |
