import { isBrowser, TOKEN_KEY } from "../util";

export interface UserItem {
  id: string;
  image: string;
  name: string;
  email: string;
  authority?: string;

  [key: string]: string | undefined;
}

export interface UserResponse {
  user?: UserItem;
  jwt?: string;
}

export const fetchUser = async () => {
  const res: UserResponse = await fetch("/server/api/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
    },
  }).then((res) => res.json());

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
