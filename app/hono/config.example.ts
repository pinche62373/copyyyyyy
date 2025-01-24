import type { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import type { HonoServerOptions } from "react-router-hono-server/node";

const config = {
  configure: (server: Hono) => {
    server.use(
      createMiddleware(async (c, next) => {
        console.log("Hono Middleware:", c.env.NODE_ENV);

        return next();
      }),
    );
  },
} as HonoServerOptions;

export default config;
