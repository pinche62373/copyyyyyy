import { redirect } from "@remix-run/node";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";

import type { User } from "#app/models/user.server";
import { getUserById, verifyLogin } from "#app/models/user.server";
import { AUTH_LOGIN_ROUTE } from "#app/utils/constants";
import {
  createDatabaseSessionStorage,
  getSession,
  sessionCookie,
} from "#app/utils/session.server";

export const EMAIL_PASSWORD_STRATEGY = "email-password-strategy";

export const authenticator = new Authenticator<User>(
  createDatabaseSessionStorage({
    cookie: sessionCookie,
  }),
  {
    sessionKey: "user",
  },
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");

    invariant(typeof email === "string", "email must be a string");
    invariant(typeof password === "string", "email must be a string");

    const user = await verifyLogin(email, password);

    if (!user) {
      throw new AuthorizationError("Authentication Failed");
    }

    return user;
  }),
  EMAIL_PASSWORD_STRATEGY,
);

export async function getUserId(
  request: Request,
): Promise<User["id"] | undefined> {
  const session = await getSession(request.headers.get("cookie"));

  const userId = session.get("userId");

  if (!userId) {
    return undefined;
  }

  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);

  if (userId === undefined) return null;

  const user = await getUserById(userId);

  if (user) return user;

  throw await authenticator.logout(request, { redirectTo: AUTH_LOGIN_ROUTE });
}

export async function requireUserId(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  const userId = await getUserId(request);
  if (!userId) {
    const requestUrl = new URL(request.url);
    redirectTo =
      redirectTo === null
        ? null
        : redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`;
    const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null;
    const loginRedirect = ["/login", loginParams?.toString()]
      .filter(Boolean)
      .join("?");
    throw redirect(loginRedirect);
  }
  return userId;
}

// ----------------------------------------------------------------------------
// MAYBE required for register route
// ----------------------------------------------------------------------------
const USER_SESSION_KEY = "userId";

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request.headers.get("cookie"));

  session.set(USER_SESSION_KEY, userId);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}
