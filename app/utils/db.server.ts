import { PrismaClient } from "@prisma/client";

import { singleton } from "../singleton.server";

type IgnorePrismaBuiltins<S extends string> = string extends S
  ? string
  : S extends ""
    ? S
    : S extends `$${string}`
      ? never
      : S;

export type PrismaModelName = IgnorePrismaBuiltins<keyof PrismaClient & string>;

// Hard-code a unique key, so we can look up the client when this module gets re-imported
const prisma = singleton("prisma", () =>
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })
);

prisma.$connect();

export { prisma };
