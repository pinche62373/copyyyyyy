import { rateLimiter as honoRateLimiter } from "hono-rate-limiter";

interface Props {
  minutes: number;
  limit: number;
}

export function rateLimiter({ minutes, limit }: Props) {
  return honoRateLimiter({
    windowMs: minutes * 60 * 1000, // window for limit in minutes
    limit, // Limit each connection to `limit` requests per `window`
    standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: (c) => c.req.header("x-api-key")!, // Method to generate custom identifiers for clients.
    message: { message: "Rate limit reached for requests" },
    // store: ... , // Redis, MemoryStore, etc. See below.
  });
}
