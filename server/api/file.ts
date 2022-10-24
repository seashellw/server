import { defineHandler, SE } from "@/util";
import { getCOSFileUrl } from "@/util/cos";

export default defineHandler(async (e) => {
  const { key } = useQuery(e);
  if (typeof key !== "string") {
    throw newError(400, "key is required");
  }
  const url = await getCOSFileUrl(key);
  if (!url) {
    throw newError(404, "file not found");
  }
  sendRedirect(e, url);
});
