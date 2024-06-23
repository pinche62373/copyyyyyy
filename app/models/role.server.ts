import type { Role } from "@prisma/client";

import { prisma } from "#app/utils/db.server";

export function getRole({ id }: Pick<Role, "id">) {
  return prisma.role.findFirst({
    where: { id },
  });
}

export function getRoles() {
  return prisma.role.findMany({
    orderBy: { name: "asc" },
  });
}

export function getRoleWithPermissions({ id }: Pick<Role, "id">) {
  return prisma.role.findFirst({
    where: { id },
    include: {
      permissions: {
        orderBy: { entity: "asc" },
      },
    },
  });
}

export function getRolesWithPermissions() {
  return prisma.role.findMany({
    orderBy: { name: "asc" },
    include: {
      permissions: {
        select: {
          entity: true,
        },
        orderBy: { entity: "asc" },
      },
    },
  });
}
