export const HOST = "/server/api";

export const isBrowser = () => {
  return typeof window !== "undefined";
};

export const TOKEN_KEY = "token";

/**
 * 类型运算，
 * 推断异步函数返回值类型
 */
export type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer U>
  ? U
  : T extends (...args: any[]) => infer V
  ? V
  : any;
