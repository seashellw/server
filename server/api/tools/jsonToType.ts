import { defineHandler } from "@/util";
import { format } from "prettier";

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

export interface ToolsJsonToTypeRequest {
  text: string;
}

export default defineHandler(async (e) => {
  const { text } = await useBody<ToolsJsonToTypeRequest>(e);
  if (!text) {
    return { text: "" };
  }
  const result = Index(text);
  return { text: result };
});
