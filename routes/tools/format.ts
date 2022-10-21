import { defineHandler } from "@/util";
import { format } from "prettier";

export interface ToolsFormatRequest {
  text: string;
  parser: string;
}

export default defineHandler(async (e) => {
  const { text, parser } = await useBody<ToolsFormatRequest>(e);
  const result = format(text, {
    parser,
  });
  return { text: result };
});
