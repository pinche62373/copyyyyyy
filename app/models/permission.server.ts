import type { Permission } from "@prisma/client";

import { prisma } from "#app/utils/db.server";

export function getPermission({ id }: Pick<Permission, "id">) {
  return prisma.permission.findFirst({
    where: { id },
    include: {
      roles: {
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      },
    },
  });
}

export function getPermissions() {
  return prisma.permission.findMany({
    orderBy: { entity: "asc" },
    include: {
      roles: {
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      },
    },
  });
}
