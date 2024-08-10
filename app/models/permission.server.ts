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
    orderBy: { resource: "asc" },
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

export function getPermissionsByResourceName(resourceName: string) {
  return prisma.permission.findMany({
    where: {
      resource: resourceName,
    },
    orderBy: { resource: "asc" },
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
