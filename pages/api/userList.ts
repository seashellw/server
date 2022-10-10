import { db } from "database";
import { UserItem } from "interface/lib/user";
import { BasicResponse, Page, PageOption } from "interface/util";
import { ADMIN } from "util/const";
import { APIHandler } from "util/tool";
import { useUserFromJWT } from "./user";

export interface UserListRequest {
  page: PageOption;
}

export interface UserListResponse extends BasicResponse {
  list?: UserItem[];
  page?: PageOption;
}
export default APIHandler<UserListRequest, UserListResponse>(
  async (ctx) => {
    const { page } = ctx.data;
    const { user } = await useUserFromJWT(ctx);
    if (user?.authority !== ADMIN) {
      return { ok: false, msg: "权限不足" };
    }
    const { current, pageSize } = page ?? {};
    if (!(current && pageSize)) {
      return { ok: false };
    }
    const newPage = new Page(current, pageSize);
    const userList = await db.user.selectAll(newPage);
    return {
      ok: true,
      list: userList.map((user) => ({
        ...user,
        authorityName: undefined,
      })),
      page: newPage,
    };
  },
  {
    method: "POST",
  }
);
