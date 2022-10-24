import { resolve } from "path";

export default defineNuxtConfig({
  alias: {
    "@": resolve(),
  },
  app: {
    baseURL: "/server",
  },
  routeRules: { "/**": { cors: true } },
});
