/**
 * 分页
 */
export abstract class Page {
  current: number = 0; // 当前页码
  pageSize: number = 0; // 每页的数量
  size?: number; // 当前页的数量
  total?: number; // 总记录数
  pages?: number; // 总页数
}

export const setTotal = (page: Page, total: number) => {
  page.total = total;
  page.pages = Math.ceil(total / page.pageSize);
  page.current = Math.min(page.current, page.pages);
  page.size = Math.min(
    page.pageSize,
    total - (page.current - 1) * page.pageSize
  );
  return page;
};
