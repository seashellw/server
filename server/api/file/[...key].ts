import { defineHandler } from "@/util/util";
import { getCOSFileUrl } from "@/util/cos";
import { getRouterParams, sendRedirect } from "h3";

export default defineHandler(async (e) => {
  let { key } = getRouterParams(e);
  const url = await getCOSFileUrl(key);
  await sendRedirect(e, url);
});
