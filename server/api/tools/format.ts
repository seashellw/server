import { defineHandler } from "@/util/util";
import { readBody } from "h3";
import { format } from "prettier";

export interface ToolsFormatRequest {
  text: string;
  parser: string;
}

export default defineHandler(async (e) => {
  const { text, parser } = await readBody<ToolsFormatRequest>(e);
  const result = format(text, {
    parser,
  });
  return { text: result };
});
