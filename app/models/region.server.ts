import type { Region } from "@prisma/client";

import { prisma } from "#app/utils/db.server";

export function getRegion({ id }: Pick<Region, "id">) {
  return prisma.region.findFirst({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      createdByUser: {
        select: {
          id: true,
          username: true,
        },
      },
      updatedByUser: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    where: { id },
  });
}

export async function getRegionById(id: Region["id"]) {
  return prisma.region.findUnique({ where: { id } });
}

export function getRegions() {
  return prisma.region.findMany({
    orderBy: { name: "asc" },
  });
}

export function createRegion({ name }: Pick<Region, "name">, userId: string) {
  return prisma.region.create({
    data: {
      name,
      updatedAt: null,
      createdBy: userId,
    },
  });
}

export function updateRegion(
  { id, name }: Pick<Region, "id" | "name">,
  userId: string,
) {
  return prisma.region.update({
    where: { id },
    data: {
      id,
      name,
      updatedBy: userId,
    },
  });
}

export function deleteRegion({ id }: Pick<Region, "id">) {
  return prisma.region.delete({
    where: { id },
  });
}
