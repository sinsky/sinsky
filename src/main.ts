import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import { routes } from "vue-router/auto-routes";
import "./assets/index.css";

export const createApp = ViteSSG(
  App,
  { routes },
  // ({ app, router, routes, isClient, initialState }) => {},
);
