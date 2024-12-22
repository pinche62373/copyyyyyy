//
// Regex used here => Capitalized Latin words, separated by spaces, no diacritics (https://regex101.com/r/lTm7Df/1)
// Variation => capitalized Unicode words, separated by spaces, allows diacritics (https://regex101.com/r/iY7iJ6/2)
//
import { z } from "zod";

import { regionSchema } from "#app/validations/region-schema";
import { userSchema } from "#app/validations/user-schema";

export const countrySchema = z.object({
  id: z.string().min(1, "This field is required").cuid2(),
  name: z
    .string()
    .min(1, "This field is required")
    .regex(/^[A-Z][a-z]+( [A-Z][a-z]+)*$/, {
      message:
        "This field only allows capitalized Latin words, separated by single spaces.",
    }),
  regionId: regionSchema.shape.id,
  createdAt: z.string().datetime(),
  createdBy: userSchema.pick({ id: true }),
  updatedAt: z.string().datetime().nullable(),
  updatedBy: userSchema.pick({ id: true }).nullable(),
  region: regionSchema.pick({
    id: true,
    name: true,
  }),
});

export const countrySchemaAdminTable = countrySchema.pick({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  region: true,
});

export const countrySchemaCreate = z.object({
  intent: z.literal("create"),
  country: countrySchema.pick({
    name: true,
    regionId: true,
  }),
});

export const countrySchemaUpdate = z.object({
  intent: z.literal("update"),
  country: countrySchema.pick({
    id: true,
    name: true,
    regionId: true,
  }),
});
