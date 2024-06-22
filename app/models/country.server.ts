import type { Country } from "@prisma/client";

import { prisma } from "#app/utils/db.server";

export function getCountry({ id }: Pick<Country, "id">) {
  return prisma.country.findFirst({
    select: {
      id: true,
      name: true,
      region: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: { id },
  });
}

export function getCountries() {
  return prisma.country.findMany({
    orderBy: { name: "asc" },
    include: {
      region: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export function createCountry(
  { name, regionId }: Pick<Country, "name" | "regionId">,
  userId: string,
) {
  return prisma.country.create({
    data: {
      name,
      regionId,
      createdBy: userId,
      updatedAt: null,
    },
  });
}

export function updateCountry(
  { id, name, regionId }: Pick<Country, "id" | "name" | "regionId">,
  userId: string,
) {
  return prisma.country.update({
    where: { id },
    data: {
      id,
      name,
      regionId,
      updatedBy: userId,
    },
  });
}

export function deleteCountry({ id }: Pick<Country, "id">) {
  return prisma.country.delete({
    where: { id },
  });
}
