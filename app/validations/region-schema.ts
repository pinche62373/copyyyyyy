//
// Regex used for `name` => Capitalized Latin words, separated by spaces, no diacritics (https://regex101.com/r/lTm7Df/1)
// Variation => capitalized Unicode words, separated by spaces, allows diacritics (https://regex101.com/r/iY7iJ6/2)
//
import { z } from "zod";

import { UserSchema } from "#app/validations/user-schema";

export const RegionSchema = z.object({
  id: z.string().min(1, "This field is required").cuid2("Invalid id"),
  name: z
    .string()
    .min(1, "This field is required")
    .regex(/^[A-Z][a-z]+( [A-Z][a-z]+)*$/, {
      message:
        "This field only allows capitalized Latin words, separated by single spaces.",
    }),
  createdAt: z.date(),
  createdBy: UserSchema.pick({ id: true }),
  updatedAt: z.date().nullable(),
  updatedBy: UserSchema.pick({ id: true }).nullable(),
});

export const RegionSchemaAdminTable = RegionSchema.pick({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
});

export const RegionSchemaCreate = z.object({
  intent: z.literal("create"),
  region: RegionSchema.pick({
    name: true,
  }),
});

export const RegionSchemaUpdate = z.object({
  intent: z.literal("update"),
  region: RegionSchema.pick({
    id: true,
    name: true,
  }),
});

export const RegionSchemaDelete = z.object({
  intent: z.literal("delete"),
  region: RegionSchema.pick({
    id: true,
  }),
});
