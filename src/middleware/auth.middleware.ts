import { Next } from "@loopback/core";
import {
  Middleware,
  MiddlewareContext,
  Request,
  Response,
} from "@loopback/rest";

export const authMiddleware: Middleware = async (
  ctx: MiddlewareContext,
  next: Next
) => {
  if (ctx.request.path === "/ping") console.log("hello from middleware");
  return await next();
};
