// Add returnTo behavior to Remix Auth : https://sergiodxa.com/tutorials/add-returnto-behavior-to-remix-auth

import { createCookie } from "react-router";
import invariant from "tiny-invariant";
import { COOKIE_SECURE } from "#app/utils/constants";

invariant(
  process.env.COOKIE_DOMAIN,
  "Environment variable not found: COOKIE_DOMAIN",
);

invariant(
  process.env.COOKIE_SECRET,
  "Environment variable not found: COOKIE_SECRET",
);

export const returnToCookie = createCookie("__returnTo", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  domain: process.env.COOKIE_DOMAIN,
  secure: COOKIE_SECURE,
  secrets: [process.env.COOKIE_SECRET],
  maxAge: 60, // 1 minute because it makes no sense to keep it for a long time
});
