import { format } from "prettier";
import { APIHandler } from "util/tool";

export interface ToolsFormatRequest {
  text: string;
  parser: string;
}

export interface ToolsFormatResponse {
  text?: string;
}

export default APIHandler<ToolsFormatRequest, ToolsFormatResponse>({
  method: "POST",
  handler: async (ctx) => {
    const { text, parser } = ctx.data;
    const result = format(text, {
      parser,
    });
    return { text: result };
  },
});
