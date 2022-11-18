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
          href: "https://cdn-1259243245.cos.ap-shanghai.myqcloud.com/gh/seashellw/seashellw/icon/favicon.ico",
        },
      ],
      title: "SERVER",
    },
  },
  routeRules: {
    "/**": { cors: true },
  },
});
