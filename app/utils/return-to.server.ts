// Add returnTo behavior to Remix Auth : https://sergiodxa.com/tutorials/add-returnto-behavior-to-remix-auth

import { createCookie } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(
  process.env.COOKIE_SECRET,
  "Environment variable not found: COOKIE_SECRET",
);

export const returnToCookie = createCookie("__returnTo", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60, // 1 minute because it makes no sense to keep it for a long time
  secrets: [process.env.COOKIE_SECRET],
  secure: process.env.NODE_ENV === "production",
});
