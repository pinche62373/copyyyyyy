import { some } from "hono/combine";
import { createHonoServer } from "react-router-hono-server/node";
import { isLocalNetwork } from "./is-local-network";
import { rateLimiter } from "./rate-limiter";

export default await createHonoServer({
  configure: (server) => {
    server.use(
      "/auth/*",
      some(isLocalNetwork(), rateLimiter({ minutes: 15, limit: 2 })), // does not run rate-limiter on local network
    );
  },
});
