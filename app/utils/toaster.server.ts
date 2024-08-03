import { setToastCookieOptions as remixToastSetCookieOptions } from "remix-toast";
import invariant from "tiny-invariant";

import { COOKIE_DOMAIN, COOKIE_SECURE } from "#app/utils/constants";

export function setToastCookieOptions() {
  invariant(
    process.env.COOKIE_SECRET,
    "Environment variable not found: COOKIE_SECRET",
  );

  remixToastSetCookieOptions({
    name: "__toast",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    domain: COOKIE_DOMAIN,
    secure: COOKIE_SECURE,
    secrets: [process.env.COOKIE_SECRET],
  });
}
