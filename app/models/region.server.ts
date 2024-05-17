import type { Region } from "@prisma/client";

import { prisma } from "#app/utils/db.server";

export function getRegion({ id }: Pick<Region, "id">) {
  return prisma.region.findFirst({
    select: { id: true, name: true },
    where: { id },
  });
}

export function getAdminRegions() {
  return prisma.region.findMany({
    orderBy: { name: "asc" },
  });
}

export function createRegion({ name }: Pick<Region, "name">) {
  return prisma.region.create({
    data: {
      name,
      updatedAt: null,
    },
  });
}

export function updateRegion({ id, name }: Pick<Region, "id" | "name">) {
  return prisma.region.update({
    where: { id },
    data: {
      id,
      name,
    },
  });
}

export function deleteRegion({ id }: Pick<Region, "id">) {
  return prisma.region.delete({
    where: { id },
  });
}
