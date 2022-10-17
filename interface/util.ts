export const HOST = "/server/api";

export const isBrowser = () => {
  return typeof window !== "undefined";
};

export const jsonParse = (str: string | undefined | null) => {
  try {
    return JSON.parse(str || "{}");
  } catch (error) {
    return {};
  }
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

/**
 * 分页
 */
export abstract class PageOption {
  // 当前页码
  current: number = 0;
  // 每页的数量
  pageSize: number = 0;
  // 当前页的数量
  size?: number;
  // 总记录数
  total?: number;
  // 总页数
  pages?: number;
}

/**
 * 分页器工具实现
 */
export class Page extends PageOption {
  constructor(current: number, pageSize: number, total?: number) {
    super();
    this.current = current;
    this.pageSize = pageSize;
    if (total) {
      this.setTotal(total);
    }
  }

  /**
   * 设置总记录数
   * @param total 总记录数
   */
  setTotal(total: number) {
    this.total = total;
    while ((this.current - 1) * this.pageSize >= this.total) {
      this.current--;
      if (this.current <= 0) {
        this.current = 1;
        break;
      }
    }
    this.pages =
      total % this.pageSize === 0
        ? total / this.pageSize
        : Math.floor(total / this.pageSize) + 1;
    this.size =
      this.current * this.pageSize > total
        ? total - (this.current - 1) * this.pageSize
        : this.pageSize;
  }

  /**
   * 拷贝一份新的对象
   */
  object(): PageOption {
    return { ...this };
  }
}
