import { resolve } from "path";

export default defineNuxtConfig({
  alias: {
    "@": resolve(),
  },
  app: {
    baseURL: "/server",
    head: {
      link: [
        {
          rel: "icon",
          href: "https://cdn.jsdelivr.net/gh/seashellw/seashellw/icon/favicon.ico",
        },
      ],
      title: "SERVER",
    },
  },
  routeRules: {
    "/**": { cors: true },
  },
});
