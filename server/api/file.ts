import { defineHandler, SE } from "@/util";
import { getCOSFileUrl } from "@/util/cos";
import { sendRedirect, getQuery } from "h3";

export default defineHandler(async (e) => {
  const { key } = getQuery(e);
  if (typeof key !== "string") {
    throw new SE(400, "query key is required");
  }
  const url = await getCOSFileUrl(key);
  await sendRedirect(e, url);
});
