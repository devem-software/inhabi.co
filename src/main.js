import { ViteSSG } from "vite-ssg";
import { createHead } from "@vueuse/head";

import App from "./App.vue";
import { routes } from "./router";

import "@/styles/global.css";
import "@/styles/system-design.css";

import { reveal } from "./directives/reveal";
import { parallax } from "./directives/parallax";

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    concurrency: 2,
    formatting: "html",
    dir: "dist",
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition;
      if (to.hash) return { el: to.hash, behavior: "smooth" };
      return { top: 0 };
    },
  },

  ({ app, head, isClient }) => {
    app.use(createHead());

    app.directive("reveal", reveal);
    app.directive("parallax", parallax);

    if (isClient) {
      import("virtual:pwa-register").then(({ registerSW }) => {
        registerSW({ immediate: true });
      });
    }
  },
);
