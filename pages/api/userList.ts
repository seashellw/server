import { db } from "database";
import { UserItem } from "interface/lib/user";
import { Page, PageOption } from "interface/util";
import { ADMIN } from "util/const";
import { APIHandler } from "util/tool";
import { getUserFromJWT } from "./user";

export interface UserListRequest {
  page: PageOption;
}

export interface UserListResponse {
  list?: UserItem[];
  page?: PageOption;
}
export default APIHandler<UserListRequest, UserListResponse>({
  method: "POST",
  handler: async (ctx) => {
    const { page } = ctx.data;
    const { user } = await getUserFromJWT(ctx);
    if (user?.authority !== ADMIN) {
      ctx.setStatus(403);
      return "权限不足";
    }
    const { current, pageSize } = page ?? {};
    if (!(current && pageSize)) {
      ctx.setStatus(400);
      return;
    }
    const newPage = new Page(current, pageSize);
    const userList = await db.user.selectAll(newPage);
    return {
      list: userList.map((user) => ({
        ...user,
        authorityName: undefined,
      })),
      page: newPage,
    };
  },
});
