import { SeedPrisma } from "@snaplet/seed/adapter-prisma";
import { defineConfig } from "@snaplet/seed/config";

import { prisma } from "#app/utils/db.server";

export default defineConfig({
  adapter: () => new SeedPrisma(prisma),
  alias: {
    inflection: false,
  },
  select: [
    "!*", // Exclude all tables except the ones whitelisted below
    "_PermissionToRole",
    "_RoleToUser",
    "Country",
    "Language",
    "Movie",
    "Password",
    "PermaLink",
    "Permission",
    "Region",
    "Role",
    "User",
  ],
});
