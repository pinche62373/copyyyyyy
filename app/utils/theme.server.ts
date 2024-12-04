import { createCookieSessionStorage } from "@remix-run/node";
import { createThemeSessionResolver } from "remix-themes";
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

export const themeSessionResolver = createThemeSessionResolver(
  createCookieSessionStorage({
    cookie: {
      name: "__theme",
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      domain: process.env.COOKIE_DOMAIN,
      secure: COOKIE_SECURE,
      secrets: [process.env.COOKIE_SECRET],
    },
  }),
);
