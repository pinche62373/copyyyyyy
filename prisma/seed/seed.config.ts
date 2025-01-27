import { SeedPrisma } from "@snaplet/seed/adapter-prisma";
import { defineConfig } from "@snaplet/seed/config";

import { prisma } from "#app/utils/db.server";

const tables = {
  prod: [
    "!*", // Exclude all tables except the ones whitelisted below
    "_PermissionToRole",
    "Permission",
    "Role",
  ],
  devOnly: [
    "_RoleToUser",
    "Country",
    "Language",
    "Movie",
    "Password",
    "PermaLink",
    "Region",
    "User",
  ],
};

const mergedTables =
  process.env.NODE_ENV === "production"
    ? tables.prod
    : tables.prod.concat(tables.devOnly);

export default defineConfig({
  adapter: () => new SeedPrisma(prisma),
  alias: {
    inflection: false,
  },
  select: mergedTables,
});
