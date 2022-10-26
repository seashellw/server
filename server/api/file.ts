import { defineHandler, SE } from "@/util";
import { getCOSFileUrl } from "@/util/cos";
import { sendRedirect } from "h3";

export default defineHandler(async (e) => {
  const { key } = useQuery(e);
  if (typeof key !== "string") {
    throw new SE(400, "key is required");
  }
  const url = await getCOSFileUrl(key);
  await sendRedirect(e, url);
});
