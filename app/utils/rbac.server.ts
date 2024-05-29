import { json } from "@remix-run/node";

import { requireUserId } from "./auth.server.ts";
import { prisma } from "./db.server.ts";
import { actions, entities, accesses } from "./rbac-permissions";
import { useUser } from "./user";

type Action = (typeof actions)[number];
type Entity = (typeof entities)[number];
type Access = (typeof accesses)[number];

export function userHasRole(
  user: Pick<ReturnType<typeof useUser>, "roles"> | null,
  role: string,
) {
  if (!user) return false;
  return user.roles.some((r) => r.name === role);
}

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
