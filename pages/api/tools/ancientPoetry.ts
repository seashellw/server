import { BasicResponse } from "interface/util";
import { APIHandler } from "util/tool";

export interface ToolsAncientPoetryResponse extends BasicResponse {
  data: {
    author: string;
    content: string[];
    title: string;
    dynasty: string;
  };
}


export default APIHandler<{}, ToolsAncientPoetryResponse>(
  async () => {
    let res = await fetch("https://v2.jinrishici.com/sentence", {
      headers: {
        "X-User-Token": "Q4nw76WdRE28SXCF9y55XZqh5GYyOXzC",
      },
    }).then((res) => res.json());
    return {
      ok: true,
      data: res.data?.origin,
    };
  },
  {
    method: "GET",
  }
);
