import { getConnInfo } from "@hono/node-server/conninfo";
import { createMiddleware } from "hono/factory";
import isLocalhost from "is-localhost-ip";

/**
 * Condition Middleware that returns true if Hono `remote.address` is a
 * localhost address. Only to be used in combination with Hono `combine`.
 */
export function isLocalNetwork() {
  return createMiddleware(async (c, next) => {
    const info = getConnInfo(c);

    if (info.remote.address && (await isLocalhost(info.remote.address))) {
      return next();
    }

    return false as unknown as void;
  });
}
