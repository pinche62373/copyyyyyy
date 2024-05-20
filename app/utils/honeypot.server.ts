import { Honeypot } from "remix-utils/honeypot/server";
import invariant from "tiny-invariant";

invariant(
  process.env.HONEYPOT_SECRET,
  "Environment variable not found: HONEYPOT_SECRET",
);

// Create a new Honeypot instance, the values here are the defaults, you can
// customize them
export const honeypot = new Honeypot({
  validFromFieldName: process.env.NODE_ENV === "test" ? null : undefined,
  encryptionSeed: process.env.HONEYPOT_SECRET, // Ideally it should be unique even between processes
});
