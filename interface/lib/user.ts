import { BasicResponse, get, isBrowser, TOKEN_KEY } from "../util";
export interface UserItem {
  [key: string]: string | undefined;
  id: string;
  image: string;
  name: string;
  email: string;
  authority?: string;
}


export interface UserResponse extends BasicResponse {
  user?: UserItem;
  jwt?: string;
}

export const fetchUser = async () => {
  const res = await get<UserResponse, {}>("/user");
  if (isBrowser()) {
    localStorage.setItem(TOKEN_KEY, res?.jwt || "");
  }
  return res;
};

export const fetchLogIn = async (path: string) => {
  const url = new URL(path);
  url.searchParams.set("from", location.href);
  url.searchParams.set("action", "logIn");
  location.href = url.toString();
};

export const fetchLogOut = async (path: string) => {
  localStorage.removeItem(TOKEN_KEY);
  const url = new URL(path);
  url.searchParams.set("from", location.href);
  url.searchParams.set("action", "logOut");
  location.href = url.toString();
};
