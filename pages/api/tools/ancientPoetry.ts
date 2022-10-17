import { APIHandler } from "util/tool";

export interface ToolsAncientPoetryResponse {
  author: string;
  content: string[];
  title: string;
  dynasty: string;
}

export default APIHandler<{}, ToolsAncientPoetryResponse>({
  method: "GET",
  handler: async () => {
    let res = await fetch("https://v2.jinrishici.com/sentence", {
      headers: {
        "X-User-Token": "Q4nw76WdRE28SXCF9y55XZqh5GYyOXzC",
      },
    }).then((res) => res.json());
    return res.data?.origin;
  },
});
