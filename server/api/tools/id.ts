import { defineHandler, getId } from "@/util/util";

export default defineHandler(async () => {
  return getId();
});
