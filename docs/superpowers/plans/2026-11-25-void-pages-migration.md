# Void pages移行 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. 実行開始時に superpowers:using-git-worktrees でワークツリーを作成すること。

**Goal:** sinsky.me を「vite-ssg + 生Cloudflare Worker（2パッケージ）」から「Void pagesモード（vite ^8 + @void/vue + `output: "static"`・1パッケージ）」へ移行し、UIを現状維持したまま package.json一本化・1プロセス開発・`void deploy` を実現する。

**Architecture:** フロントは `pages/index.vue` + `pages/layout.vue`（@void/vueアダプタ、`output: "static"` でビルド時に事前レンダリング）。問い合わせバックエンドは `pages/index.server.ts` の `action`（`withValidator` + 共有zodスキーマ `src/lib/contactSchema.ts`）が純関数 `src/lib/contactSubmit.ts`（honeypot判定・Slack通知コア、`worker/src/worker.ts` から移植）を呼ぶ。head/meta は `void.config.ts`（サイト共通）+ `index.server.ts` の `head()`（ページ固有OG）。旧 `worker/`・`wrangler.jsonc`・vite-ssg・unplugin-vue-router・vee-validate は削除。

**Tech Stack:** void 1.11 / @void/vue 1.11 / vite ^8.3.8（素のVite・Vite+不可）/ vitest ^5 / zod ^4.6.7 / msw ^3（node）/ Tailwind 4 / Node 26 / pnpm 10

**Spec:** `design-plans/2026-11-25-void-pages-migration-design.md`

## Global Constraints

- パッケージマネージャ: **pnpm 10**（`packageManager: "pnpm@10.33.4"` 変更しない）
- Node **26**（mise経由。`.nvmrc` = `26`）
- 素の **vite ^8.3.8**（Vite+にしない。`void@1.11.0` の peer は `vite ^8.0.0`）
- devDependencies 追加: `void ^1.11.0`、`@void/vue ^1.11.0`、`msw ^3.0.0`
- 依存削除: `vite-ssg`, `unplugin-vue-router`, `vue-router`, `@unhead/vue`, `vee-validate`, `@vee-validate/zod`, `@vitejs/plugin-vue`（voidVueが内包）, `@cloudflare/vitest-pool-workers`, `@msw/cloudflare`
- `zod ^3.24.3 → ^4.6.7`、`vitest ^4.1.11 → ^5.1.1`
- 日本語文言（**verbatim・変更禁止**）:
  - name 必須: `お名前を入力してください`
  - email: `有効なメールアドレスを入力してください`
  - message min: `内容は最低10文字以上入力してください`
  - message max: `内容は5000文字以内で入力してください`
  - toast 成功: `送信完了` / 説明 `確認後、返答いたします。`
  - toast 失敗: `送信エラー` / 説明 `お手数ですが、再度送信してください。`
  - name max（新規・後述の不整合解消）: `お名前は100文字以内で入力してください`
  - email max（新規）: `メールアドレスが長すぎます`
- 既知の不整合の解消方針: 現行は name 上限がクライアント50 / サーバー100で食い違い、クライアント側は英語デフォルトメッセージが露出している。**サーバー側の真実（100）+ 日本語メッセージ**に統一する（51〜100文字のnameが受付可能になる挙動変化は許可済み）
- UI不改変ファイル（テンプレート・クラス・文言・ロジック一切変更禁止）: `src/components/{Hero,Profile,Skills,SectionNav,Reveal}.vue`、`src/components/form/{FormButton,FormLabel,FormInput,FormTextarea,FormHint,FormError}.vue`、`src/components/ui/**`、`public/**`
- テストは `tests/` 配下のみ（`pages/`・`routes/` はVoidの慣例ディレクトリのため配置不可）
- コミットは各タスク末尾（husky + lint-staged が oxfmt を実行するためフォーマットは自動）
- コマンドはすべてmise環境で実行（`mise exec -- pnpm ...` 形式で統一）

## Review Focus

specが暗黙に要求し、かつタスク内テストが直接担保しない入力クラス（最も刺さりやすい順）:

1. **Honeypot回避** — botが `bot-field` を埋めた送信 → 拒否され、Slackへ**何も送られない**。→ Task 4 のテスト（mswでリクエスト数0を表明）
2. **Slackペイロードへの注入** — name/message内の `<` `>` `&` → `&lt;` `&gt;` `&amp;` にエスケープ。→ Task 4 のテスト（blocks内容の完全一致）
3. **webhook未設定での本番運用** — `SLACK_WEBHOOK_URL` 無しで送信 → 優雅な失敗（500相当）、クラッシュしない。→ Task 4 のテスト
4. **事前レンダリング済みmetaの欠落** — ビルド後のHTMLから title/og一式/description/charset/viewport/lang/theme-color/favicon が消える。→ Task 5 のビルド出力grep
5. **二重送信** — 送信中にボタンが押せない（`form.pending` → disabled+スピナー）。→ Task 5 のdev smoke

サーバー側スキーマ検証（クライアントバイパス入力）は action が Task 3 のスキーマをそのまま使うため、Task 3 のスキーマテストが担保する。

---

### Task 1: 依存関係・ツールチェーンの更新

**Files:**
- Modify: `package.json`
- Modify: `.nvmrc`
- Modify: `pnpm-workspace.yaml`

**Interfaces:**
- Consumes: なし
- Produces: インストール済みの `void` CLI（後続タスクが `pnpm exec void` で使用）、vite 8 で動く `vite.config.ts` の土台

- [ ] **Step 1: package.json を更新する**

dependencies から削除: `@unhead/vue`, `@vee-validate/zod`, `unplugin-vue-router`, `vee-validate`
dependencies 変更: `zod: "^3.24.3"` → `"^4.6.7"`
devDependencies から削除: `@vitejs/plugin-vue`, `vite-ssg`, `vue-router`
devDependencies 変更: `vite: "^6.3.4"` → `"^8.3.8"`、`vitest: "^4.1.11"` → `"^5.1.1"`
devDependencies 追加: `"void": "^1.11.0"`, `"@void/vue": "^1.11.0"`, `"msw": "^3.0.0"`
scripts 変更: `"build": "vue-tsc -b && vite build"`、追加 `"types": "void prepare"`、追加 `"deploy": "void deploy"`、削除 `"preview"`

- [ ] **Step 2: .nvmrc を `26` にする**

- [ ] **Step 3: pnpm-workspace.yaml から `packages:` の `- worker` を削除する**（`allowBuilds`・`overrides` はそのまま維持）

- [ ] **Step 4: インストールする**

Run: `mise exec -- pnpm install`
Expected: exit 0。ブロックされたビルドスクリプトの警告が出た場合は `mise exec -- pnpm approve-builds` で承認（esbuild/sharp/workerd等。`allowBuilds` への追記でもよい）し再実行。

- [ ] **Step 5: バージョン検証**

Run: `mise exec -- pnpm exec vite --version` → 8系（例: `vite/8.3.8`）
Run: `mise exec -- pnpm exec vitest --version` → 5系
Run: `node -v` → v26系

**注意:** この時点で `pnpm build` / `pnpm test` は src が削除済み依存（vee-validate等）を import しているため失敗する。**Task 5 完了まで壊れたままで正常**（中間状態の赤は想定内）。

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml .nvmrc pnpm-workspace.yaml
git commit -m "chore: migrate toolchain to void (vite 8, vitest 5, zod 4)"
```

### Task 2: Void設定の骨格

**Files:**
- Create: `void.config.ts`
- Create: `env.ts`
- Modify: `vite.config.ts`（全面書き換え）
- Modify: `.gitignore`
- Modify: `src/vite-env.d.ts`

**Interfaces:**
- Consumes: `void`, `@void/vue`（Task 1）
- Produces: `voidPlugin()` 入りの `vite.config.ts`（Task 3/4 のvitest実行が依存）、`env.SLACK_WEBHOOK_URL` / `env.VITE_CONTACT_EMAIL`（`import { env } from "void/env"`。Task 5 が使用）

- [ ] **Step 1: void.config.ts を作成する**

```ts
import { defineConfig } from "void/config";

export default defineConfig({
  output: "static",
  routing: { typedRoutes: true },
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
```

- [ ] **Step 2: env.ts を作成する**

`VITE_` 接頭辞キーはビルド時にクライアントへ、それ以外はサーバー専用シークレットになる。両方 `optional()` とし、未設定時の挙動は現行どおりランタイムで処理する（フォーム側は `v-if`、webhook側は Task 4 の500相当パス）。

```ts
import { defineEnv, string } from "void/env";

export default defineEnv({
  VITE_CONTACT_EMAIL: string().optional(),
  SLACK_WEBHOOK_URL: string().optional(),
});
```

- [ ] **Step 3: vite.config.ts を書き換える**

```ts
/// <reference types="vitest" />

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { voidPlugin } from "void";
import { voidVue } from "@void/vue/plugin";
import vueDevTools from "vite-plugin-vue-devtools";
import Icons from "unplugin-icons/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [voidPlugin(), voidVue(), vueDevTools(), Icons(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

（`voidVue()` がフレームワークのViteプラグインを含むため `vue()` は不要）

- [ ] **Step 4: .gitignore に生成物 `.void/` を追加する**（`dist` 行の近くでよい）

- [ ] **Step 5: src/vite-env.d.ts から `/// <reference types="unplugin-vue-router/client" />` 行を削除する**

- [ ] **Step 6: 型生成を実行して検証する**

Run: `mise exec -- pnpm exec void prepare`
Expected: exit 0、`.void/` ディレクトリが生成される（gitignore済み）

- [ ] **Step 7: Commit**

```bash
git add void.config.ts env.ts vite.config.ts .gitignore src/vite-env.d.ts
git commit -m "feat: add void config, env schema, and vite 8 plugin stack"
```

### Task 3: 共有スキーマ contactSchema（TDD）

**Files:**
- Create: `src/lib/contactSchema.ts`
- Test: `tests/contactSchema.test.ts`

**Interfaces:**
- Consumes: zod ^4（Task 1）
- Produces: `contactSchema`（zodスキーマ）と `ContactFormValues`（z.infer型: `{ "bot-field": string; name: string; email: string; message: string }`）。Task 4/5 が使用

- [ ] **Step 1: 失敗するテストを書く**

`tests/contactSchema.test.ts` に以下のケースを書く（文言は Global Constraints の verbatim）:

```ts
import { contactSchema } from "@/lib/contactSchema";
import { describe, expect, it } from "vitest";

const valid = { "bot-field": "", name: "sinsky", email: "sin@example.com", message: "Hello, this is a contact form test." };

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    expect(contactSchema.parse(valid)).toEqual(valid);
  });

  it("defaults bot-field to an empty string when absent", () => {
    const { "bot-field": _ignored, ...withoutBotField } = valid;
    expect(contactSchema.parse(withoutBotField)["bot-field"]).toBe("");
  });

  it("rejects a blank name with the Japanese message", () => {
    const r = contactSchema.safeParse({ ...valid, name: "   " });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.find((i) => i.path[0] === "name")?.message).toBe("お名前を入力してください");
    }
  });

  it("rejects a 101-character name", () => {
    expect(contactSchema.safeParse({ ...valid, name: "a".repeat(101) }).success).toBe(false);
  });

  it("rejects an invalid email with the Japanese message", () => {
    const r = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.find((i) => i.path[0] === "email")?.message).toBe("有効なメールアドレスを入力してください");
    }
  });

  it("rejects an email longer than 254 characters", () => {
    expect(contactSchema.safeParse({ ...valid, email: `${"a".repeat(250)}@x.com` }).success).toBe(false);
  });

  it("rejects a short message with the Japanese message", () => {
    const r = contactSchema.safeParse({ ...valid, message: "short" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.find((i) => i.path[0] === "message")?.message).toBe("内容は最低10文字以上入力してください");
    }
  });

  it("rejects a 5001-character message", () => {
    expect(contactSchema.safeParse({ ...valid, message: "あ".repeat(5001) }).success).toBe(false);
  });
});
```

- [ ] **Step 2: テストが失敗することを確認する**

Run: `mise exec -- pnpm exec vitest run tests/contactSchema.test.ts`
Expected: FAIL（`@/lib/contactSchema` が存在しない）

- [ ] **Step 3: src/lib/contactSchema.ts を実装する**

zod v4 のトップレベル `z.email()` を使用（`z.string().email()` はv4で非推奨）。name/message の `.trim()` は現行サーバーの「trim後空チェック」をスキーマに一体化する。

```ts
import { z } from "zod";

export const contactSchema = z.object({
  "bot-field": z.string().default(""),
  name: z
    .string()
    .trim()
    .min(1, "お名前を入力してください")
    .max(100, "お名前は100文字以内で入力してください"),
  email: z
    .email("有効なメールアドレスを入力してください")
    .max(254, "メールアドレスが長すぎます"),
  message: z
    .string()
    .trim()
    .min(10, "内容は最低10文字以上入力してください")
    .max(5000, "内容は5000文字以内で入力してください"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
```

- [ ] **Step 4: テストが通ることを確認する**

Run: `mise exec -- pnpm exec vitest run tests/contactSchema.test.ts`
Expected: PASS（8 tests）

- [ ] **Step 5: Commit**

```bash
git add src/lib/contactSchema.ts tests/contactSchema.test.ts
git commit -m "feat: add shared contact form schema"
```

### Task 4: 通知コア contactSubmit（TDD・workerテストの移植）

**Files:**
- Create: `src/lib/contactSubmit.ts`
- Test: `tests/contactSubmit.test.ts`
- 参照（移植元・読み取り専用）: `worker/src/worker.ts`、`worker/test/worker.test.ts`

**Interfaces:**
- Consumes: `ContactFormValues`（Task 3）
- Produces: `submitContact(values: ContactFormValues, webhookUrl: string | undefined): Promise<SubmitResult>`。`SubmitResult = { ok: true } | { ok: false; status: 422 | 500 | 502; message: string }`。Task 5 の action が使用。フレームワーク非依存（fetch と env 値のみ使用）のため、テストはmswのモックfetchに対して直接実行できる

- [ ] **Step 1: 失敗するテストを書く**

`tests/contactSubmit.test.ts` を書く。ファイル先頭に `// @vitest-environment node` を付ける（happy-domのfetchではなくNodeのhttpをmswがインターセプトするため）。`worker/test/worker.test.ts` の次のケースを移植する:

```ts
// @vitest-environment node
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { submitContact } from "@/lib/contactSubmit";

const SLACK_URL = "https://hooks.slack.com/services/T0000000/B0000000/XXXXXXXXXXXXXXXXXXXXXXXX";
const valid = { "bot-field": "", name: "sinsky", email: "sin@example.com", message: "Hello, this is a contact form test." };

const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

ケース（元テストの期待値をそのまま使用）:

1. **honeypot拒否**: `submitContact({ ...valid, "bot-field": "spam" }, SLACK_URL)` → `{ ok: false, status: 422, message: "bot detected" }`。mswのモックハンドラー内で `let slackCalls = 0` をインクリメントするようにし、実行後に `slackCalls === 0` を表明（拒否された場合にSlackへ何も送られないことの証明）
2. **成功とエスケープ**: `submitContact({ ...valid, name: "sinsky <test>", message: "hello <world> & friends" }, SLACK_URL)` → `{ ok: true }`。キャプチャしたSlack body（JSON）のblocksが元テストと完全一致: `blocks[0].text.text === "New contact form submission"`、`blocks[1].fields[0].text === "*Name*\nsinsky &lt;test&gt;"`、`blocks[1].fields[1].text === "*Email*\nsin@example.com"`、`blocks[2].text.text === "hello &lt;world&gt; &amp; friends"`
3. **Slack失敗**: モックが500を返す → `{ ok: false, status: 502, message: "failed to notify slack" }`
4. **webhook未設定**: `submitContact(valid, undefined)` → `{ ok: false, status: 500, message: "server is not configured" }`（Slackへのfetchが発生しない）

- [ ] **Step 2: テストが失敗することを確認する**

Run: `mise exec -- pnpm exec vitest run tests/contactSubmit.test.ts`
Expected: FAIL（`@/lib/contactSubmit` が存在しない）

- [ ] **Step 3: src/lib/contactSubmit.ts を実装する**

`worker/src/worker.ts` から `escapeSlack`・`buildSlackPayload`（blocks構造・ヘッダーテキスト `New contact form submission`）を**そのまま移植**する。`submitContact` の判定順:

1. `values["bot-field"]` が空でない → `{ ok: false, status: 422, message: "bot detected" }`
2. `webhookUrl` が falsy → `{ ok: false, status: 500, message: "server is not configured" }`
3. `fetch(webhookUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(buildSlackPayload(values)) })` → `!res.ok` なら `{ ok: false, status: 502, message: "failed to notify slack" }`
4. 成功 → `{ ok: true }`

- [ ] **Step 4: テストが通ることを確認する**

Run: `mise exec -- pnpm exec vitest run tests/contactSubmit.test.ts`
Expected: PASS

- [ ] **Step 5: 併せてスキーマテストも通ることを確認する**

Run: `mise exec -- pnpm exec vitest run`
Expected: `tests/` 配下の全テストが PASS（この時点でsrcのUIはまだ壊れているが、vitestは `tests/` しか対象にしないため通る）

- [ ] **Step 6: Commit**

```bash
git add src/lib/contactSubmit.ts tests/contactSubmit.test.ts
git commit -m "feat: port contact notification core from worker"
```

### Task 5: pages/UI 切り替え（cutover）

**Files:**
- Create: `pages/layout.vue`
- Create: `pages/index.vue`
- Create: `pages/index.server.ts`
- Modify: `src/components/Contact.vue`
- Modify: `src/components/form/FieldText.vue`
- Modify: `src/components/form/FieldArea.vue`
- Modify: `tsconfig.app.json`
- Create（ローカルのみ・コミットしない）: `.env`
- Delete: `src/App.vue`、`src/main.ts`、`src/pages/index.vue`、`typed-router.d.ts`、`index.html`

**Interfaces:**
- Consumes: `contactSchema`・`ContactFormValues`（Task 3）、`submitContact`・`SubmitResult`（Task 4）、`env`（Task 2）、`useForm`・`Form` は `@void/vue`
- Produces: 動作するVoidアプリ（`pnpm build`・`pnpm dev`・`pnpm test` が緑の状態）

- [ ] **Step 1: pages/layout.vue を作成する**

```vue
<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import "@/assets/index.css";
</script>

<template>
  <slot />
  <Toaster richColors closeButton />
</template>
```

（旧 `App.vue` の `<router-view>` は slot に置換。Toaster のpropsは verbatim）

- [ ] **Step 2: pages/index.vue を作成する**

`src/pages/index.vue` の内容を移動する。`<script setup>` から `useHead`/`useSeoMeta` の import と2つの呼び出しを削除し、`Hero`/`Profile`/`Skills`/`Contact`/`SectionNav` の import と `<template>` は**そのまま**。

- [ ] **Step 3: pages/index.server.ts を作成する**

```ts
import { defineHandler, defineHead } from "void";
import { env } from "void/env";
import { contactSchema } from "@/lib/contactSchema";
import { submitContact } from "@/lib/contactSubmit";

export const head = defineHead(() => ({
  title: "sinsky.me",
  titleTemplate: "",
  meta: [
    { name: "description", content: "sinskyのプロフィールページへようこそ！" },
    { property: "og:description", content: "sinskyのプロフィールページへようこそ！" },
    { property: "og:image", content: "https://github.com/sinsky.png" },
    { property: "og:site_name", content: "sinsky.me" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://sinsky.me" },
    { property: "og:locale", content: "ja" },
  ],
}));

export const action = defineHandler.withValidator({ body: contactSchema })(
  async (c, { body }) => {
    const result = await submitContact(body, env.SLACK_WEBHOOK_URL);
    if (!result.ok) {
      return c.text(result.message, result.status);
    }
  },
);
```

（500/502のプレーンテキスト応答はクライアントでthrow→toastエラー、422は `form.error` に残る。og:image・og:url は絶対URLなので prerender でも正しく出力される）

- [ ] **Step 4: Contact.vue を書き換える**

`<template>` は現行の構造・クラス・文言を維持し、変更点は次の3点のみ:

1. `<form @submit="onSubmit" ...>` → `<form @submit.prevent="onSubmit" ...>`（vee-validateの `handleSubmit` が内部的にpreventしていた分を明示する）
2. `<FieldText>` / `<FieldArea>` に `v-model` と `:error` を渡す（例: `v-model="form.data.name"` `:error="form.errors.name"`）
3. honeypot 入力の `@input="onBotField"` は `form.setData("bot-field", (event.target as HTMLInputElement).value)` に置換

`<script setup>` は `useForm`（`@void/vue`）+ 共有スキーマ事前検証とする:

```ts
const form = useForm("/", { "bot-field": "", name: "", email: "", message: "" }, { resetOnSuccess: true });

async function onSubmit() {
  const parsed = contactSchema.safeParse(form.data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      form.setError(issue.path[0] as "bot-field" | "name" | "email" | "message", issue.message);
    }
    return;
  }
  try {
    await form.post();
    if (form.wasSuccessful) {
      toast.success("送信完了", { description: "確認後、返答いたします。" });
    }
  } catch {
    toast.error("送信エラー", { description: "お手数ですが、再度送信してください。" });
  }
}
```

（`FormButton :loading="form.pending"` は既存propsのまま繋げる。`resetOnSuccess` が旧 `resetForm()` を代替）

- [ ] **Step 5: FieldText.vue / FieldArea.vue を制御コンポーネント化する**

`useField`（vee-validate）を削除し、次のシグネチャにする（両ファイルとも同一方針）:

- props: 既存（`name`, `label`, `placeholder`, `autocomplete`, `hint`, `required`, `type`/`rows`）+ `modelValue: string` + `error?: string`
- emits: `"update:modelValue"`
- `<FormInput>`/`<FormTextarea>` は `:modelValue` + `@update:modelValue="$emit('update:modelValue', $event)"` で接続、`@blur` は削除（値更新はv-modelで伝播）
- エラー表示の条件を `!!errorMessage && meta.touched` → `!!error` に、`FormHint` の `v-if` を `hint && !error` に置換。`FormLabel`/`FormHint`/`FormError` の構成・`describedBy` の計算・クラスは現行のまま

（エラー表示のタイミングは「送信時の事前検証またはサーバー422後のみ」となり、現行のvee-validate UXと同等）

- [ ] **Step 6: 旧ファイルを削除する**

`src/App.vue`、`src/main.ts`、`src/pages/index.vue`、`typed-router.d.ts` を `git rm` する。
`index.html` は「VoidがHTMLシェルを生成するか」を `pnpm build` 実行時に確認してから削除する（`dist/client/index.html` が void 生成で存在すれば削除。index.html を残すと二重シェルになるため必ずどちらかを確定させる）。

- [ ] **Step 7: tsconfig.app.json の include を更新する**

`"./typed-router.d.ts"` を削除し、次を追加: `"pages/**/*.ts"`, `"pages/**/*.vue"`, `"env.ts"`, `".void/**/*.d.ts"`（`src/**` と `paths @/*` はそのまま）

- [ ] **Step 8: 型を再生成してビルドする**

Run: `mise exec -- pnpm exec void prepare`
Run: `mise exec -- pnpm run build`
Expected: `vue-tsc -b` exit 0 → `vite build` exit 0。`pages/` の検出と prerender が実行されるログが出る

- [ ] **Step 9: 事前レンダリング済みHTMLのmeta検証**

Run: `grep -o '<title>[^<]*</title>' dist/client/index.html` → `<title>sinsky.me</title>`
Run: `grep -c 'og:image.*github.com/sinsky.png\|og:url.*sinsky.me\|og:locale.*ja\|name="description"\|name="theme-color" content="#fbcfe8"\|lang="ja"\|charset=\|favicon.svg' dist/client/index.html`
Expected: すべての要素が1以上ヒット（欠落したmetaがあればStep 3の `head()` か `void.config.ts` に戻って修正）

- [ ] **Step 10: ローカル .env を作成する（コミットしない）**

`worker/.dev.vars` の `SLACK_WEBHOOK_URL` 値をルート `.env` へコピーする（gitignore済み）。`VITE_CONTACT_EMAIL` は現行 `.env` に既にあれば合わせて記載。

- [ ] **Step 11: dev smoke**

Run: バックグラウンドで `mise exec -- pnpm dev`
Expected:
1. `http://localhost:5173` で Hero/Profile/Skills/Contact/SectionNav が現行どおり表示される
2. フォームを空のまま「送信」→ 3フィールドに日本語インラインエラー（文言は Global Constraints どおり）、ネットワーク送信は発生しない
3. 「送信」ボタン押下中は disabled+スピナー（`form.pending`）
4. **実webhookへの実送信は行わない**（Slackに実通知が飛ぶため。成功経路はTask 4のモックテストとTask 7の本番検証で担保）

- [ ] **Step 12: 全テスト再確認**

Run: `mise exec -- pnpm exec vitest run`
Expected: PASS

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: cut over frontend to void pages mode"
```

### Task 6: 旧構成の削除・CI/環境整理

**Files:**
- Delete: `worker/`（ディレクトリ全体）、`wrangler.jsonc`、`.wrangler/`（gitignore済み・ファイルシステム削除）
- Modify: `.gitignore`
- Modify: `.env.example`
- Modify: `.github/workflows/vitest.yaml`
- Modify: `vitest.config.ts`

**Interfaces:**
- Consumes: なし（Task 5完了後の緑状態を維持する整理タスク）
- Produces: 単一パッケージ構成のrepo（package.json 1つ・CI緑）

- [ ] **Step 1: 旧ファイルを削除する**

`git rm -r worker` / `git rm wrangler.jsonc` / `rm -rf .wrangler`
（`worker/.dev.vars` の値は Task 5 Step 10 で `.env` 移行済みであることを先に確認）

- [ ] **Step 2: .gitignore の worker 固有行を削除する**

`worker/.dev.vars`、`worker/worker-configuration.d.ts`、`worker/typed-router.d.ts` の3行（コメント行含む）を削除

- [ ] **Step 3: .env.example を一本化する**

```
# ビルド時にクライアントへ埋め込まれる公開値（連絡先表示用）
VITE_CONTACT_EMAIL=contact@sinsky.me

# サーバー専用シークレット（本番は `void secret set` で設定）
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ
```

- [ ] **Step 4: vitest.config.ts から `exclude: [...configDefaults.exclude, "worker/**"]` の `"worker/**"` を削除する**

- [ ] **Step 5: .github/workflows/vitest.yaml を更新する**

worker 用3ステップ（`Generate worker types` / `Worker typecheck` / `Worker test`）を削除し、`Build` ステップの前に `void prepare`（型生成）ステップを追加する:

```yaml
      - name: Generate void types
        run: pnpm run types

      - name: Build
        run: pnpm run build

      - name: Test
        run: pnpm run test
```

（`fmt:check`・mise・`pnpm install --frozen-lockfile` はそのまま）

- [ ] **Step 6: 全体緑を確認する**

Run: `mise exec -- pnpm run fmt:check` → exit 0
Run: `mise exec -- pnpm run build` → exit 0
Run: `mise exec -- pnpm run test` → PASS（CI=true環境相当でwatchにならずrunされる）

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove legacy worker package and wrangler config"
```

### Task 7: 本番切替（オペレーション — ユーザーのCloudflare認証が必要）

**Files:** 変更なし（コード外のオペレーション。PRマージ後に実施）

- [ ] **Step 1: シークレット設定**

Run: `mise exec -- pnpm exec void secret --help` で構文を確認し、`SLACK_WEBHOOK_URL` を設定（値は旧 `worker/.dev.vars` のもの）
Expected: デプロイ前にシークレットが検証される（env.ts 宣言済みのため）

- [ ] **Step 2: カスタムドメイン接続**

`void` CLI の domains 系コマンド（`mise exec -- pnpm exec void --help` で確認）または Cloudflare ダッシュボードで `sinsky.me` を新しい Void Worker に接続する

- [ ] **Step 3: デプロイ**

Run: `mise exec -- pnpm run deploy`
Expected: ビルド → provision → アップロードが完了しURLが出力される

- [ ] **Step 4: 本番検証**

1. `https://sinsky.me` が表示され、ビルド出力と同じmeta（title/OG）が出ている
2. フォームを実際に送信し、Slackに通知が届くことをユーザーと共に確認
3. この初回実送信で honeypot が正常動作することも併せて確認

- [ ] **Step 5: 問題時のロールバック**

Run: `mise exec -- pnpm exec void project rollback`
（旧 Worker は削除していないため、ドメインを戻せば旧構成も復旧可能）

- [ ] **Step 6: （任意）旧 Worker の削除**

本番確認後、旧 `sinsky` Worker の削除はユーザー判断で実施（`wrangler delete`）。Repo側は Task 6 で整理済み
