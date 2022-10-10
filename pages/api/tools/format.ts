import { BasicResponse } from "interface/util";
import { format } from "prettier";
import { APIHandler } from "util/tool";

export interface ToolsFormatRequest {
  text: string;
  parser: string;
}

export interface ToolsFormatResponse extends BasicResponse {
  text?: string;
}

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
