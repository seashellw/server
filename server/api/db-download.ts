import { downloadDatabase } from "@/database/init";
import { defineHandler, SE } from "@/util/util";
import { useLogInState } from "./user";

export default defineHandler(async (e) => {
  const { user } = await useLogInState(e);
  if (user.authority !== "admin") {
    throw new SE(403, "权限不足");
  }
  return await downloadDatabase();
});
