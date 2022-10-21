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
