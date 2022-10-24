import { defineHandler } from "@/util";

export default defineHandler(async () => {
  let res = await fetch("https://v2.jinrishici.com/sentence", {
    headers: {
      "X-User-Token": "Q4nw76WdRE28SXCF9y55XZqh5GYyOXzC",
    },
  }).then((res) => res.json());
  return res.data?.origin;
});
