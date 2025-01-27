import { redirect } from "react-router";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { parseFormData } from "remix-hook-form";
import type { User } from "#app/queries/user.server.ts";
import { getUserById, verifyLogin } from "#app/queries/user.server.ts";
import { ROUTE_HOME, ROUTE_LOGIN } from "#app/utils/constants";
import { prisma } from "#app/utils/db.server";
import {
  commitSession,
  getSession,
  sessionCookie,
} from "#app/utils/session.server";

export const EMAIL_PASSWORD_STRATEGY = "email-password-strategy";

export const authenticator = new Authenticator<User>();

// ----------------------------------------------------------------------------
// RR7: custom authenticate
// ----------------------------------------------------------------------------
export async function authenticate(request: Request, returnTo?: string) {
  const user = await authenticator.authenticate(
    EMAIL_PASSWORD_STRATEGY,
    request,
  );

  // authentication succeeded, set cookie data
  const session = await getSession(request.headers.get("cookie"));
  session.set("user", user);

  // create database session in the redirect
  throw redirect(returnTo || "/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

// ----------------------------------------------------------------------------
// RR7: isAuthenticated clone
// ----------------------------------------------------------------------------
export async function isAuthenticated(request: Request, returnTo?: string) {
  let session = await getSession(request.headers.get("cookie"));

  if (session.get("user")) {
    return true;
  }

  throw redirect(returnTo || ROUTE_LOGIN);
}

// ----------------------------------------------------------------------------
// RR7: blockAuthenticated
// ----------------------------------------------------------------------------
export async function blockAuthenticated(request: Request, route: string) {
  const headers = new Headers();
  const sessionId = await sessionCookie.parse(request.headers.get("Cookie"));

  // orphaned session cookies without a matching database record crash
  // prisma so we need to delete that cookie first using a redirect to
  // the page that is blocking the authenticated users.
  if (sessionId) {
    const databaseSessionExists = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!databaseSessionExists) {
      headers.append(
        "Set-Cookie",
        await sessionCookie.serialize("", {
          maxAge: 0,
        }),
      );

      throw redirect(route, { headers });
    }
  }

  // redirect authenticated users back to homepage
  let session = await getSession(request.headers.get("cookie"));
  let user = session.get("user");

  if (user) throw redirect(ROUTE_HOME);
}

// TODO solve this better
interface LoginProps {
  user: {
    email: string;
    password: string;
  };
}

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const formData: LoginProps = await parseFormData(form); // remix-hook-form: strings to object

    const email = formData.user.email;
    const password = formData.user.password;

    const user = await verifyLogin(email, password);

    if (!user) {
      throw new Error("Authentication Failed");
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

// MUST return null to align with prisma result
export async function getUser(request: Request) {
  const userId = await getUserId(request);

  if (!userId) return null;

  const user = await getUserById(userId);

  if (!user) return null;

  return user;
}

export async function getUserOrDie(request: Request) {
  const user = await getUser(request);
  if (user === null) {
    throw new Error("User cannot be null here");
  }
  return user;
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
        : (redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`);
    const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null;
    const loginRedirect = [ROUTE_LOGIN, loginParams?.toString()]
      .filter(Boolean)
      .join("?");
    throw redirect(loginRedirect);
  }
  return userId;
}
