import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { authenticator } from "#app/utils/auth.server";
import { prisma } from "#app/utils/db.server";
import { sessionCookie } from "#app/utils/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const sessionId = await sessionCookie.parse(request.headers.get("Cookie"));

  // delete orphaned client-side session cookie not existing in database to prevent breaking remix-auth
  if (sessionId) {
    const databaseSessionExists = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!databaseSessionExists) {
      return json(null, {
        headers: {
          "Set-Cookie": await sessionCookie.serialize("", {
            maxAge: 0,
          }),
        },
      });
    }
  }

  await authenticator.logout(request, { redirectTo: "/" });
};

export const loader = async () => redirect("/");
