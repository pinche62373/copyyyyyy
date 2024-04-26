import type { Language } from "@prisma/client";

import { prisma } from "~/db.server";

export function getLanguage({ id }: Pick<Language, "id">) {
  return prisma.language.findFirst({
    select: { id: true, name: true },
    where: { id },
  });
}

export function getLanguages() {
  return prisma.language.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
  