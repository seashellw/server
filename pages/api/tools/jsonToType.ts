import { format } from "prettier";
import { APIHandler } from "util/tool";
import { ToolsFormatResponse } from "./format";

const JsonObjectToType = (jsonObject: any) => {
  let result = "";
  if (typeof jsonObject !== "object") {
    let type = typeof jsonObject;
    result += `${type}`;
    return result;
  }
  if (Array.isArray(jsonObject)) {
    result += JsonObjectToType(jsonObject[0]);
    result += "[]";
    return result;
  }
  result += "{\n";
  for (const key in jsonObject) {
    const element = jsonObject[key];
    result += `${key}:${JsonObjectToType(element)};\n`;
  }
  result += "}";
  return result;
};

const Index = (json: string) => {
  try {
    const jsonObject = JSON.parse(json);
    let result = JsonObjectToType(jsonObject);
    result = `type JsonType = ${result};`;
    return format(result, {
      parser: "typescript",
    });
  } catch (e) {
    console.error(e);
    return "";
  }
};

export type ToolsJsonToTypeResponse = ToolsFormatResponse;

export interface ToolsJsonToTypeRequest {
  text: string;
}

export default APIHandler<ToolsJsonToTypeRequest, ToolsJsonToTypeResponse>({
  method: "POST",
  handler: async (ctx) => {
    const { text } = ctx.data;
    if (!text) {
      return { text: "" };
    }
    const result = Index(text);
    return { text: result };
  },
});
