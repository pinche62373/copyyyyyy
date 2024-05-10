import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";

import { Theme, isTheme } from "./theme-provider";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "my_remix_theme",
    secure: true,
    secrets: [process.env.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    expires: new Date("2099-12-31"),
    httpOnly: true,
  },
});

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get("Cookie"));
  return {
    getTheme: () => {
      const themeValue = session.get("theme");
      return isTheme(themeValue) ? themeValue : Theme.DARK;
    },
    setTheme: (theme: Theme) => session.set("theme", theme),
    commit: () => themeStorage.commitSession(session),
  };
}

export { getThemeSession };

