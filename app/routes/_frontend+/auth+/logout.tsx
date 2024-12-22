import type { ActionFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { authenticator } from "#app/utils/auth.server";
import { prisma } from "#app/utils/db.server";
import { mergeHeaders } from "#app/utils/lib/merge-headers";
import { returnToCookie } from "#app/utils/return-to.server";
import { sessionCookie } from "#app/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const sessionId = await sessionCookie.parse(request.headers.get("Cookie"));

  const deleteCookieHeaders = mergeHeaders([
    [
      "Set-Cookie",
      await sessionCookie.serialize("", {
        maxAge: 0,
      }),
    ],
    [
      "Set-Cookie",
      await returnToCookie.serialize("", {
        maxAge: 0,
      }),
    ],
  ]);

  // delete orphaned client-side session cookie not existing in database to prevent breaking remix-auth
  if (sessionId) {
    const databaseSessionExists = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!databaseSessionExists) {
      return data(null, {
        headers: deleteCookieHeaders,
      });
    }
  }

  await authenticator.logout(request, {
    redirectTo: "/",
    headers: deleteCookieHeaders,
  });
};

export const loader = async () => redirect("/");
