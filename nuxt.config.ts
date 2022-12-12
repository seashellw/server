import { resolve } from "path";
import socket from "./modules/socket";

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
          href: "https://cdn.seashellw.world/icon/favicon.ico",
        },
      ],
      title: "SERVER",
    },
  },
  routeRules: {},
  modules: [socket],
});
