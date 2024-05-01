import type { Language } from "@prisma/client";

import { prisma } from "#app/db.server";

export function getLanguage({ id }: Pick<Language, "id">) {
  return prisma.language.findFirst({
    select: { id: true, name: true },
    where: { id },
  });
}

export function getAdminLanguages() {
  return prisma.language.findMany({
    orderBy: { name: "asc" },
  });
}

export function createLanguage({
  name,
}: Pick<Language, "name">) {
  return prisma.language.create({
    data: {
      name,
      updatedAt: null
    },
  });
}

export function updateLanguage({
  id,
  name,
}:Pick<Language, "id" | "name">) {
  return prisma.language.update({
    where: { id },
    data: {
      id,
      name,
      // updatedAt: d
    },
  });
}

export function deleteLanguage({
  id,
}: Pick<Language, "id">) {
  return prisma.language.delete({
    where: { id },
  });
}