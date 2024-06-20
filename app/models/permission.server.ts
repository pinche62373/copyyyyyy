import { prisma } from "#app/utils/db.server";

export function getPermissions() {
  return prisma.permission.findMany({
    orderBy: { entity: "asc" },
    include: {
      roles: {
        select: {
          name: true,
        },
      },
    },
  });
}
