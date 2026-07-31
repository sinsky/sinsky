/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="unplugin-icons/types/vue3" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_CONTACT_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
