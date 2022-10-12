import { APIHandler } from "util/tool";
import { getCOSFileUrl } from "util/cos";

interface FileDownloadRequest {
  key: string;
}

export default APIHandler<FileDownloadRequest, {}>(
  async (ctx) => {
    const { key } = ctx.data;
    if (!key) {
      ctx.res.status(400).send("key is required");
      return;
    }
    const url = await getCOSFileUrl(key);
    if (!url) {
      ctx.res.status(404).send("file not found");
      return;
    }
    ctx.res.redirect(url);
  },
  {
    method: "GET",
  }
);
