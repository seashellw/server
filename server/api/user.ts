import { tokenDB } from "@/database/token";
import { UserItem } from "@/interface/lib/user";
import { defineHandler, SE } from "@/util";
import { H3Event, getHeader } from "h3";

export const useToken = (e: H3Event) => {
  let token = getHeader(e, "authorization");
  if (!token) throw new SE(401, "未登录");
  return token;
};

export interface LogInState {
  user: UserItem;

  token: string;
}

export const useLogInState: (e: H3Event) => Promise<LogInState> = async (e) => {
  let token = useToken(e);
  let item = await tokenDB.selectById(token);
  if (!item) throw new SE(401, "登录状态已过期");
  let state: LogInState = {
    user: item.user,
    token: item.id,
  };
  return state;
};

export default defineHandler(async (e) => {
  let { user } = await useLogInState(e);

  if (user) {
    return { user };
  }
});
