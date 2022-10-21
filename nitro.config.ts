import { defineNitroConfig } from "nitropack";
import { resolve } from "path";

export default defineNitroConfig({
  baseURL: "/server/api",
  compressPublicAssets: {
    gzip: true,
    brotli: true,
  },
  routeRules: { "/**": { cors: true } },
  sourceMap: false,
  alias: {
    "@": resolve(),
  },
});
