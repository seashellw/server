import { defineEventHandler, EventHandler, H3Error } from "h3";
import { nanoid } from "nanoid";

export class SE extends H3Error {
  constructor(code: number, msg?: string) {
    super();
    this.statusCode = code;
    this.message = msg || "Something went wrong";
  }
}

export const defineHandler = (handler: EventHandler) =>
  defineEventHandler(async (e) => {
    try {
      let res = await handler(e);
      if (!res) {
        e.res.end();
      }
      return res;
    } catch (err) {
      if (err instanceof SE) {
        e.res.statusCode = err.statusCode;
        e.res.end(err.message);
        return;
      } 
      
      if (err instanceof Error) {
        e.res.statusCode = 500;
        e.res.end(err.message);
        return;
      } else {
        e.res.statusCode = 500;
        e.res.end(err);
      }
    }
  });

export const getId = () => nanoid(64);
