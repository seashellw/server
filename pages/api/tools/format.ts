import { ToolsFormatRequest, ToolsFormatResponse } from "interface";
import { format } from "prettier";
import { APIHandler } from "util/tool";

export default APIHandler<ToolsFormatRequest, ToolsFormatResponse>(
  async (req) => {
    const { text, parser } = req.data;
    try {
      const result = format(text, {
        parser,
      });
      return { ok: true, text: result };
    } catch (e) {
      return { ok: false };
    }
  },
  {
    method: "POST",
  }
);
