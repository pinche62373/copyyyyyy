//
// Regex used here => Capitalized Latin words, separated by spaces, no diacritics (https://regex101.com/r/lTm7Df/1)
// Variation => capitalized Unicode words, separated by spaces, allows diacritics (https://regex101.com/r/iY7iJ6/2)
//
import { z } from "zod";

import { RegionSchema } from "#app/validations/region-schema";
import { UserSchema } from "#app/validations/user-schema";

export const CountrySchema = z.object({
  id: z.string().min(1, "This field is required").cuid2(),
  name: z
    .string()
    .min(1, "This field is required")
    .regex(/^[A-Z][a-z]+( [A-Z][a-z]+)*$/, {
      message:
        "This field only allows capitalized Latin words, separated by single spaces.",
    }),
  regionId: RegionSchema.shape.id,
  createdAt: z.date(),
  createdBy: UserSchema.pick({ id: true }),
  updatedAt: z.date().nullable(),
  updatedBy: UserSchema.pick({ id: true }).nullable(),
  region: RegionSchema.pick({
    id: true,
    name: true,
  }),
});

export const CountrySchemaAdminTable = CountrySchema.pick({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  region: true,
});

export const CountrySchemaCreate = z.object({
  intent: z.literal("create"),
  country: CountrySchema.pick({
    name: true,
    regionId: true,
  }),
});

export const CountrySchemaUpdate = z.object({
  intent: z.literal("update"),
  country: CountrySchema.pick({
    id: true,
    name: true,
    regionId: true,
  }),
});
