import { defineHandler, SE } from "@/util";
import { getCOSFileUrl } from "@/util/cos";

export default defineHandler(async (e) => {
  const { key } = useQuery(e);
  if (typeof key !== "string") {
    throw new SE(400, "key is required");
  }
  const url = await getCOSFileUrl(key);
  if (!url) {
    throw new SE(404, "file not found");
  }
  sendRedirect(e, url);
});
