//
// Regex used for `name` => Capitalized Latin words, separated by spaces, no diacritics (https://regex101.com/r/lTm7Df/1)
// Variation => capitalized Unicode words, separated by spaces, allows diacritics (https://regex101.com/r/iY7iJ6/2)
//
import { z } from "zod";

import { userSchema } from "#app/validations/user-schema";

export const regionSchemaFull = z.object({
  id: z.string().cuid2(),
  name: z
    .string({ required_error: "Region name is required" })
    .regex(/^[A-Z][a-z]+( [A-Z][a-z]+)*$/, {
      message:
        "This field only allows capitalized Latin words, separated by single spaces."
    }),
  createdAt: z.string().datetime(),
  createdBy: userSchema.pick({ id: true }),
  updatedAt: z.string().datetime().nullable(),
  updatedBy: userSchema.pick({ id: true }).nullable()
});

export const regionSchemaAdminTable = regionSchemaFull.pick({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true
});

export const regionSchemaCreate = z.object({
  intent: z.literal("create"),
  region: regionSchemaFull.pick({
    name: true
  })
});

export const regionSchemaUpdateForm = regionSchemaFull.pick({
  id: true,
  name: true
});
