import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import isLocalhost from "is-localhost-ip";

/**
 * Throws an exception if remote address is not a localhost address so we can
 * use it with `combine` to disable rate-limiting for local development.
 * TODO replace new URL with getConnInfo() when fixed
 */
export const localNetwork = createMiddleware(async (c, next) => {
  if (!(await isLocalhost(new URL(c.req.url).hostname))) {
    throw new HTTPException(401, { message: "Not a localhost address" });
  }

  await next();
});
