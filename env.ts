import { defineEnv, string } from "void/env";

/**
 * このファイルが環境変数の宣言（正）である。ローカル値は gitignore 済みの `.env` に、
 * 本番シークレットは `void secret set <KEY>` で設定する（`.env.example` は Voidの慣例上使わない）。
 */
export default defineEnv({
  // ビルド時にクライアントへ埋め込まれる公開値（連絡先の代替表示用）
  VITE_CONTACT_EMAIL: string().optional(),
  // サーバー専用シークレット（例: https://hooks.slack.com/services/XXX/YYY/ZZZ）
  SLACK_WEBHOOK_URL: string().optional(),
});
