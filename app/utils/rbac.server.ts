import { json } from "@remix-run/node";

import { requireUserId } from "./auth.server.ts";
import { prisma } from "./db.server.ts";
import { actions, entities, accesses } from "./rbac-permissions";

type Action = (typeof actions)[number];
type Entity = (typeof entities)[number];
type Access = (typeof accesses)[number];

export async function requireUserWithRole(
  request: Request,
  name: string | string[],
) {
  const userId = await requireUserId(request);

  name = Array.isArray(name) ? name : [name];

  const user = await prisma.user.findFirst({
    select: { id: true },
    where: { id: userId, roles: { some: { name: { in: name } } } },
  });
  if (!user) {
    throw json(
      {
        error: "Unauthorized",
        requiredRole: name,
        message: `Unauthorized: required role: ${name}`,
      },
      { status: 403 },
    );
  }
  return user.id;
}
