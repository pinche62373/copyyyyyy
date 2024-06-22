import type { Language } from "@prisma/client";

import { prisma } from "#app/utils/db.server";

export function getLanguage({ id }: Pick<Language, "id">) {
  return prisma.language.findFirst({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      languageCreatedBy: {
        select: {
          id: true,
          username: true,
        },
      },
      languageUpdatedBy: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    where: { id },
  });
}

export function getLanguages() {
  return prisma.language.findMany({
    orderBy: { name: "asc" },
  });
}

export function createLanguage(
  { name }: Pick<Language, "name">,
  userId: string,
) {
  return prisma.language.create({
    data: {
      name,
      updatedAt: null,
      createdBy: userId,
    },
  });
}

export function updateLanguage(
  { id, name }: Pick<Language, "id" | "name">,
  userId: string,
) {
  return prisma.language.update({
    where: { id },
    data: {
      id,
      name,
      updatedBy: userId,
    },
  });
}

export function deleteLanguage({ id }: Pick<Language, "id">) {
  return prisma.language.delete({
    where: { id },
  });
}
