import { FileAuthorizationResponse } from "interface";
import { APIHandler } from "util/tool";

export default APIHandler<{}, FileAuthorizationResponse>(
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
