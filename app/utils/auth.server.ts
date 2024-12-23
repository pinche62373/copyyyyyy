import { redirect } from "react-router";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { parseFormData } from "remix-hook-form";
import type { User } from "#app/models/user.server";
import { getUserById, verifyLogin } from "#app/models/user.server";
import { ROUTE_LOGIN, ROUTE_LOGOUT } from "#app/utils/constants";
import { getSession } from "#app/utils/session.server";

export const EMAIL_PASSWORD_STRATEGY = "email-password-strategy";

export const authenticator = new Authenticator<User>();

// RR7: isAuthenticated clone
export async function isAuthenticated(request: Request, returnTo?: string) {
  let session = await getSession(request.headers.get("cookie"));

  if (session.get("user")) {
    return true;
  }

  throw redirect(returnTo || ROUTE_LOGIN);
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

export async function getUser(request: Request) {
  const userId = await getUserId(request);

  if (userId === undefined) return null;

  const user = await getUserById(userId);

  if (user) return user;

  redirect(ROUTE_LOGOUT);
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
