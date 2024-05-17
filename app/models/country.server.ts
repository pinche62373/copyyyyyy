import type { Country } from "@prisma/client";

import { prisma } from "#app/utils/db.server";

export function getCountry({ id }: Pick<Country, "id">) {
  return prisma.country.findFirst({
    select: { id: true, name: true },
    where: { id },
  });
}

export function getAdminCountries() {
  return prisma.country.findMany({
    orderBy: { name: "asc" },
  });
}

export function createCountry({ name }: Pick<Country, "name">) {
  return prisma.country.create({
    data: {
      name,
      regionId: "clw9imvha0007jqmslvuugk1d",
      updatedAt: null,
    },
  });
}

export function updateCountry({ id, name }: Pick<Country, "id" | "name">) {
  return prisma.country.update({
    where: { id },
    data: {
      id,
      name,
    },
  });
}

export function deleteCountry({ id }: Pick<Country, "id">) {
  return prisma.country.delete({
    where: { id },
  });
}
