import { defineHandler, getId } from "@/util";

export default defineHandler(async () => {
  return getId();
});
