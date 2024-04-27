import type { Language } from "@prisma/client";

import { prisma } from "~/db.server";

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
