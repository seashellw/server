import { defineHandler, SE } from "@/util";
import { getCOSFileUrl } from "@/util/cos";
import { sendRedirect } from "h3";

export default defineHandler(async (e) => {
  const { key } = e.context.params;
  if (!key) {
    throw new SE(404, "Not Found");
  }
  const url = await getCOSFileUrl(key);
  if (!url) {
    throw new SE(404, "file not found");
  }
  await sendRedirect(e, url);
});
