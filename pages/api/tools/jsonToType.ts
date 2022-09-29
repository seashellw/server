import {
  ToolsJsonToTypeRequest,
  ToolsJsonToTypeResponse,
} from "interface";
import { format } from "prettier";
import { APIHandler } from "util/tool";

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

export default APIHandler<
  ToolsJsonToTypeRequest,
  ToolsJsonToTypeResponse
>(
  async (req) => {
    const { text } = req.data;
    if (!text) {
      return { ok: false, text: "" };
    }
    try {
      const result = Index(text);
      return { ok: true, text: result };
    } catch (e) {
      return { ok: false };
    }
  },
  {
    method: "POST",
  }
);
