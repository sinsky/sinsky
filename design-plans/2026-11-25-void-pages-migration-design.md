# Void pagesモードへの移行設計（改訂版）

Written against: HEAD (main)
改訂: 2026-11-25 — 依頼者承認に基づき①vite ^8へ更新 ②問い合わせフォームのaction化（方向は実装側に委譲）③.nvmrc 26 を反映

## 目的・背景

sinsky.me の現行構成は「Vite + vite-ssg（フロント、ルートpackage.json）」と「生Cloudflare Worker（worker/ サブパッケージ）」の二本立てで、package.json が2つあり、開発も `vite` と `wrangler dev` の2プロセスが必要。これを VoidZero の **Void**（`void` npmパッケージ、pagesモード + `@void/vue` アダプタ）へ移行し、**package.json一本化・`pnpm dev` 1プロセス開発・`void deploy` による統合デプロイ・エコシステム（typed forms、loader/action、型付きルート、将来のauth/cron/D1等）への乗り換え**を実現する。

## 目標

- package.json をルート1つに一本化する
- 開発体験を1プロセスに統一する（`pnpm dev` のみ）
- 事前レンダリング（SSG相当）と OGP/meta 出力を維持する
- 問い合わせフォームを Void の action + `useForm` に乗せ、バリデーションスキーマをクライアント/サーバーで一元化する
- 既存テスト資産（worker/test/worker.test.ts）の有効ケースを Void の Node vitest に移植する
- デプロイを `void deploy` に集約する

## 非目標

- Vite+（rolldown）への切替 — Void の peer は `vite ^8.0.0` のため、素の **vite ^8** を採用。Vite+ は移行後の別タスクとする
- CI への `void deploy` 追加（現行どおり手動デプロイ）
- コンテンツ・文言・ビジュアルの改変

## 抗目標（失敗条件）

- **フォームの見た目・エラー文言・toast 挙動が変わること**（内部実装の置き換えは可）
- 事前レンダリングされた HTML・OGP/meta が失われること
- 検証・Slack通知まわりのテスト網羅が移行前より減ること

## 制約

- パッケージマネージャはプロジェクト規約の **pnpm 10**（lockfile既存）
- Node は **26** へ統一（`.nvmrc` の22を更新。vite@8 は `node ^20.19 || >=22.12`、mise.toml が既に26）
- pnpm-workspace.yaml のセキュリティ系 overrides は維持する
- 依存の裏付け: `void@1.11.0` peers `vite ^8.0.0`, `zod ^3.25 || ^4`, `@void/vue@1.11.0` peers `vue ^3.5`, `vite ^8.0.0`。保持プラグインの vite 8 対応: `@tailwindcss/vite@4.3.5` ✓ / `vite-plugin-vue-devtools@8.2.1` ✓ / `unplugin-icons@24.0.0` ✓ / `vitest@5.1.1`（^4→^5への更新が必要）✓

## 検討したアプローチ

1. **SPA + APIモード**（フロント温存、vite-ssg撤去）— 最小変更だが事前レンダリング（SEO）を失い、エコシステム活用も薄い。不採用
2. **Void pagesモード + `output: "static"`**（採用）— SSGをVoidが引き継ぎ、エコシステムの中核に乗れる。対象が1ページのため移行範囲は限定
3. **vite-ssgを「静的サイト+バックエンド」として残す** — 同一vite.configでビルドパイプラインが衝突する恐れ。不採用

フォームのバックエンドは2案を比較した:

- **routes/api/contact.ts + 既存fetch** — UI変更ゼロだが、クライアント（vee-validate+zod）とサーバー（手書き検証）で検証ロジックが二重管理のまま
- **index.server.ts の action + `useForm`**（採用）— zodスキーマ1本をサーバー（`withValidator`）とクライアント（事前検証・型推論）で共有でき、vee-validate / @vee-validate/zod を依存から外せる。プログレッシブ・エンハンスメントも標準で付く。依頼者の「向いている方向に実装を変更して構いません」に基づきこちらへ

`/api/contact` の外部コンシューマは存在しない（唯一の利用者は Contact.vue）ため、エンドポイント廃止の影響は閉じている。

## 設計

### ファイルマップ

**新規作成**

| ファイル                       | 内容                                                                                                                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/index.vue`              | `src/pages/index.vue` を移動。`useHead`/`useSeoMeta` を削除し、コンポーネント構成（Hero/Profile/Skills/Contact/SectionNav）はそのまま                                        |
| `pages/index.server.ts`        | `head()`（defineHead）+ `action`（defineHandler.withValidator + 薄いグルー）。失敗は `c.text(message, status)` で返す                                                        |
| `src/lib/contactSubmit.ts`     | 通知コアの純関数（honeypot判定・Slack blocks生成・エスケープ・webhook送信・結果判定）。`worker/src/worker.ts` から移植し、actionから呼ぶ。コンテキスト非依存のためテスト容易 |
| `pages/layout.vue`             | `App.vue` 相当: `<Toaster richColors closeButton />` + 子ページ描画。グローバルCSS（`src/assets/index.css`）の import はここで                                               |
| `src/lib/contactSchema.ts`     | 共有 zod スキーマ（zod ^4）。現行 Contact.vue の z.object（日本語エラー文言・最大長・honeypot `bot-field`）を1本化                                                           |
| `void.config.ts`               | `output: "static"`、`head`（htmlAttrs `lang: "ja"`、charset、viewport、favicon link）、`routing.typedRoutes: true`                                                           |
| `env.ts`                       | `SLACK_WEBHOOK_URL` をサーバー専用シークレットとして宣言                                                                                                                     |
| `tests/contact-action.test.ts` | 後述「テスト」参照                                                                                                                                                           |

**変更**

| ファイル                                              | 変更内容                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vite.config.ts`                                      | `voidPlugin()` + `voidVue()` を追加。`VueRouter()`/`vue()` を削除。`vueDevTools()`/`Icons()`/`tailwindcss()` は維持                                                                                                                                                                                                                                                             |
| `package.json`                                        | scripts: `build: "vue-tsc -b && vite build"`、`types: "void prepare"`、`deploy: "void deploy"`。devDeps: +`void`, +`@void/vue`、vite ^6→**^8.3.8**、vitest ^4→**^5**、zod ^3.24.3→**^4**、−`vite-ssg`, −`unplugin-vue-router`, −`vue-router`, −`@unhead/vue`, −`vee-validate`, −`@vee-validate/zod`, −`@cloudflare/vitest-pool-workers`, −`@msw/cloudflare`（`msw` 本体は残す） |
| `src/components/Contact.vue`                          | vee-validate の `useForm` → Void の `useForm` + `<Form :form="form">`。送信は `await form.post()` の結果（`wasSuccessful` / throw）で toast 分岐、成功時 `resetOnSuccess` でクリア。送信前・blur時に共有スキーマで `setError` し、即時インラインエラーを維持。honeypot は `form.data["bot-field"]` に bind。テンプレート構造・文言・クラスは不改変                              |
| `src/components/form/FieldText.vue` / `FieldArea.vue` | `useField`（vee-validate）を削除し、制御された表示コンポーネント化（`modelValue` + `error` props + emit）。`FormLabel`/`FormInput`/`FormTextarea`/`FormHint`/`FormError` の a11y 構成（describedBy・aria）と見た目はそのまま                                                                                                                                                    |
| `pnpm-workspace.yaml`                                 | `packages: [worker]` を削除。`allowBuilds` を void の要件に合わせ調整（セキュリティ overrides は維持）                                                                                                                                                                                                                                                                          |
| `.nvmrc`                                              | `22` → `26`                                                                                                                                                                                                                                                                                                                                                                     |
| `.env.example`                                        | `VITE_CONTACT_EMAIL` と `SLACK_WEBHOOK_URL` をルート1ファイルに一本化（コメントは `void secret set` を案内）                                                                                                                                                                                                                                                                    |
| `.github/workflows/vitest.yaml`                       | worker 用3ステップ（types/typecheck/test）を削除し、ルートの build/test に統合                                                                                                                                                                                                                                                                                                  |
| `tsconfig.json`                                       | `.void/tsconfig.json` を extends（`void init --tsconfig`）                                                                                                                                                                                                                                                                                                                      |
| `.gitignore`                                          | `.void/` を追加                                                                                                                                                                                                                                                                                                                                                                 |
| `src/vite-env.d.ts`                                   | `unplugin-vue-router/client` 参照を削除                                                                                                                                                                                                                                                                                                                                         |

**削除**: `worker/` ディレクトリ全体、`wrangler.jsonc`、`src/App.vue`、`src/main.ts`、`src/pages/index.vue`、`typed-router.d.ts`、`index.html`（Void がシェルを生成する場合。void init の出力で最終判断）

**無変更**: `src/components/Hero.vue` / `Profile.vue` / `Skills.vue` / `SectionNav.vue` / `Reveal.vue`、`src/components/form/` の `FormButton`/`FormLabel`/`FormInput`/`FormTextarea`/`FormHint`/`FormError`、`public/`、husky/lint-staged、oxfmt 設定

### head / meta の移行対応

| 現在                                                | 移行先                                                     |
| --------------------------------------------------- | ---------------------------------------------------------- |
| `useHead` の `htmlAttrs: { lang: "ja" }`            | `void.config.ts` → `head.htmlAttrs`                        |
| `index.html` の charset / viewport / favicon        | `void.config.ts` → `head.meta` + `head.link`               |
| `useSeoMeta`（title, description, og*, themeColor） | `pages/index.server.ts` の `head()`（`titleTemplate: ""`） |

`og:image`（`https://github.com/sinsky.png`）と `og:url` は既に絶対URLのため、prerender でも正しく出力される（Void SSGドキュメントの指示どおり）。

### 問い合わせフォーム（action設計）

- `pages/index.server.ts` に単一 `action` を export（POST / ）。`withValidator({ body: contactSchema })` を使用（Standard Schema対応のため素のzod ^4スキーマが直接渡せる）
- 通知コアは `src/lib/contactSubmit.ts` に純関数として切り出す: `submitContact(values: ContactFormValues, webhookUrl: string | undefined)` → `{ ok: true } | { ok: false; status: 422|500|502; message: string }`。actionはこれを呼び、`!ok` の場合 `c.text(message, status)` を返す（500/502はクライアントでthrow→toast、422は`form.error`）
- サーバー側検証は contactSchema が唯一の真実。追加のサーバー専用チェック（長さ上限の厳密化が必要なら）もここに集約
- honeypot: `bot-field` はスキーマの `z.string().default("")` として宣言。値が入っていれば検証エラー（現行の422 "bot detected" と同様にボットを拒否）
- Slack 通知ロジック（blocks生成・`escapeSlack`・webhook送信・失敗時のエラー）は現行 `worker/src/worker.ts` からほぼそのまま移植。失敗時は `HTTPException`（500/502 相当）→ クライアントの throw → `toast.error`
- 成功時: return なし → loader無しページの再描画は実質 no-op。クライアントは `wasSuccessful` で `toast.success` + `resetOnSuccess`
- 送信は現行どおり**プログラマティック**（`<form @submit.prevent>` + `await form.post()`）とし、Voidの`<Form>`自動送信は使わない。理由: 送信前のクライアント事前検証（インラインエラー即時表示）を現行のvee-validateと同じタイミングで維持するため。JS必須な点は現行と同じ（`<Form>`への切替によるno-JS対応は将来の改善余地）
- `useForm` の型（URL・body・エラーキー）は action のスキーマから自動推論される
- **既知の差分（許容）**: `/` が `.server.ts` コンパニオンを持つため、Hybrid挙動として `/` の配信も Worker 経由になる（現行は静的直配信）。prerender済みHTMLを edge から返すため実質的な差は小さい。また body パースは Void 側の管理となる

### 環境変数

- ローカル: `.env`（gitignore）に `VITE_CONTACT_EMAIL` + `SLACK_WEBHOOK_URL`（`worker/.dev.vars` から移行）。`VITE_` 接頭辞は Vite 8 でもそのまま有効
- 本番: `void secret set SLACK_WEBHOOK_URL`（`wrangler secret put` の代替）
- `env.ts` で `SLACK_WEBHOOK_URL` をサーバー専用として宣言し、クライアントバンドルへ露出しない

### テスト

`worker/test/worker.test.ts` のうち、意味が残るケースを2つのテストファイルに移植する:

- **`tests/contactSchema.test.ts`**（スキーマ）: 有効payload通過 / honeypot `bot-field` default "" / 空白name→日本語メッセージ / 101文字name拒否 / 不正email→メッセージ / 254文字超email拒否 / 9文字message→メッセージ / 5001文字message拒否
- **`tests/contactSubmit.test.ts`**（通知コア）: honeypot拒否（Slackへのリクエスト無し）/ Slack送信成功（エスケープ検証込み・blocks内容の完全一致）/ Slack失敗（502相当）/ webhook未設定（500相当）。実行は `// @vitest-environment node` + `msw/node` の `setupServer`
- **廃止**: routing 404（URLルーティングはVoidが管理）/ content negotiation 415・malformed JSON・form-encoded（bodyパースはVoidが管理）
- 実行方法: Node vitest、Slack webhook は `msw/node` の `setupServer` でモック。action ハンドラを直接起動するパターンは Void の reference/api/handlers（test utilities）に従う
- テストは `tests/` 配下（`routes/`・`pages/` は慣例ディレクトリのため配置不可）

### デプロイ切替手順

1. ブランチで移行を完結させ、ローカル検証（`pnpm dev` 1プロセスでページ+フォーム送信、`pnpm build` で事前レンダリング確認、`pnpm test` 全緑、`vue-tsc -b` 通過）
2. `void secret set SLACK_WEBHOOK_URL`、カスタムドメイン（sinsky.me）を Void デプロイへ接続
3. `void deploy` → 本番でフォーム送信含む動作確認
4. 問題があれば `void project rollback`。旧 Worker（Cloudflare上）は本番確認後に削除（任意・`wrangler delete`）

repo から旧ファイルを削除しても、切り替えまでは現行本番 Worker が Cloudflare 上で稼働し続けるため安全。

## 私が決めた事項（依頼者承認済み・確認歓迎）

- **素の vite ^8.3.8**（Void peer `^8.0.0` と完全一致。Vite+は後日別タスク）
- **フォームは action 化し vee-validate / @vee-validate/zod を依存から除去**（見た目・文言は維持、`useForm` + 共有スキーマで置き換え）
- `.nvmrc` 22 → 26
- vitest ^4 → ^5（vite 8 peer 対応）
- 旧ファイルの削除は移行コミットで一括（旧本番は Cloudflare 上に残るため切り替え前に影響なし）

## 実装者に残す事項

- `index.html` の扱い — void がシェルを生成するか確認の上、削除/維持を判断
- `allowBuilds` / `overrides` の最終形（void 依存が workerd/esbuild/sharp のどれを必要とするか）
- カスタムドメイン接続の具体的手段（`void` CLI の domains 系コマンド or ダッシュボード）
- `name` の最大長は現行クライアント50文字（英語デフォルトメッセージ）/ サーバー100文字の不整合を**100文字（サーバー側の真実）+ 日本語メッセージ**に統一することをプランで確定済み。この変更により、51〜100文字のnameが受付可能になる（現行はクライアントで拒否されていた）

## 検証

- `pnpm dev` のみで `http://localhost:5173` のページ表示とフォーム送信（Slackモック or 実webhook）が動く
- フォームUIの同等性: ラベル・placeholder・エラー文言（日本語）・エラー表示位置・送信中のdisable・成功/失敗 toast が現行と同じ見た目
- `pnpm build` 後 `dist/client/index.html` が事前レンダリング済みで、title/og/meta が現行と同等
- `pnpm test` 全緑（移植ケースを含む）、`vue-tsc -b` 通過
- 本番切替後、フォーム送信で Slack 通知が届く
