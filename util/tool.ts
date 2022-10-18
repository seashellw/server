import CORS from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_METHODS_TYPE } from "util/const";

const cors = CORS();

/**
 * 接口处理程序装饰函数
 */
export function APIHandler<Request, Response>(option: {
  handler: (ctx: {
    data: Request;
    setStatus: (status: number) => NextApiResponse<Response>;
    req: NextApiRequest;
    res: NextApiResponse<Response>;
  }) => Promise<void | Response | string | null>;
  method: HTTP_METHODS_TYPE;
}) {
  return async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    await new Promise((resolve) => cors(req, res, (err) => resolve(err)));
    if (req.method !== option.method) {
      res.status(405).end();
      return;
    }
    let body = (req.body as Request) || {};
    let query = (req.query as any as Request) || {};
    try {
      const handlerReturn = await option.handler({
        data: { ...query, ...body } as Request,
        req,
        res,
        setStatus: (status) => res.status(status),
      });
      if (!handlerReturn) {
        res.end();
        return;
      }
      if (typeof handlerReturn === "string") {
        res.end(handlerReturn);
        return;
      }
      if (typeof handlerReturn === "object") {
        res.json(handlerReturn);
        return;
      }
    } catch (e: any) {
      res.status(500).end(e.message);
      return;
    }
  };
}
