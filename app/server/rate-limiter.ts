// https://github.com/rhinobase/hono-rate-limiter

import { rateLimiter } from "hono-rate-limiter";

export default rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => c.req.header("x-api-key")!, // Method to generate custom identifiers for clients.
  message: { message: "Rate limit reached for requests" },
  // store: ... , // Redis, MemoryStore, etc. See below.
});
