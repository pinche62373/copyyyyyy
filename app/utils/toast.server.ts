import { setToastCookieOptions as remixToastSetCookieOptions } from "remix-toast";
import invariant from "tiny-invariant";

export function setToastCookieOptions() {
  invariant(
    process.env.COOKIE_SECRET,
    "Environment variable not found: COOKIE_SECRET",
  );

  remixToastSetCookieOptions({
    name: "__toast",
    secrets: [process.env.COOKIE_SECRET],
  });
}
