import { uploadDatabase } from "@/database/init";
import { defineHandler, SE } from "@/util/util";
import { readBody } from "h3";
import { useLogInState } from "./user";

export default defineHandler(async (e) => {
  const { user } = await useLogInState(e);
  if (user.authority !== "admin") {
    throw new SE(403, "权限不足");
  }
  let data = await readBody(e);
  await uploadDatabase(data);
});
