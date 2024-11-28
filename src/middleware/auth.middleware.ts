import { Next } from "@loopback/core";
import {
  Middleware,
  MiddlewareContext,
  Request,
  Response,
} from "@loopback/rest";
import { routes } from "../constants";

export const authMiddleware: Middleware = async (
  ctx: MiddlewareContext,
  next: Next
) => {
  if (routes.includes(ctx.request.path)) {
    if (
      !ctx.request.headers.authorization ||
      !ctx.request.headers.authorization.split(" ")[1]
    ) {
      return ctx.response.status(401).json({
        status: "Not Authorized",
        data: null,
      });
    }
  }
  return await next();
};
