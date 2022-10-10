import CORS from "cors";
import { BasicResponse } from "interface/util";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_METHODS_TYPE } from "util/const";

const cors = CORS();

/**
 * 接口处理程序装饰函数
 */
export function APIHandler<Request, Response>(
  handler: (ctx: {
    data: Request;
    req: NextApiRequest;
    res: NextApiResponse<Response>;
  }) => Promise<void | Response>,
  option: {
    method: HTTP_METHODS_TYPE;
  }
) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse<Response | BasicResponse>
  ) => {
    await new Promise((resolve) => cors(req, res, (err) => resolve(err)));
    if (req.method !== option.method) {
      return res.json({ ok: false, msg: "请求方法错误" });
    }
    let body = (req.body as Request) || {};
    let query = (req.query as any as Request) || {};
    const handlerReturn = await handler({
      data: { ...query, ...body } as Request,
      req,
      res,
    });
    if (handlerReturn) {
      return res.json(handlerReturn);
    }
  };
}
