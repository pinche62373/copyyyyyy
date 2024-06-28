//
// Regex used here => Capitalized Latin words, separated by spaces, no diacritics (https://regex101.com/r/lTm7Df/1)
// Variation => capitalized Unicode words, separated by spaces, allows diacritics (https://regex101.com/r/iY7iJ6/2)
//
import { z } from "zod";

import { regionSchemaFull } from "#app/validations/region-schema";
import { userSchema } from "#app/validations/user-schema";

export const countrySchemaFull = z.object({
  id: z.string().cuid2(),
  name: z
    .string({ required_error: "Country is required" })
    .regex(/^[A-Z][a-z]+( [A-Z][a-z]+)*$/, {
      message:
        "This field only allows capitalized Latin words, separated by single spaces.",
    }),
  regionId: z.string({ required_error: "You must select a region" }).cuid2(),
  createdAt: z.string().datetime(),
  createdBy: userSchema.pick({ id: true }),
  updatedAt: z.string().datetime().nullable(),
  updatedBy: userSchema.pick({ id: true }).nullable(),
  region: regionSchemaFull.pick({
    id: true,
    name: true,
  }),
});

export const countrySchemaAdminTable = countrySchemaFull.pick({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  region: true,
});

export const countrySchemaCreateForm = countrySchemaFull.pick({
  name: true,
  regionId: true,
});

export const countrySchemaUpdateForm = countrySchemaFull.pick({
  id: true,
  name: true,
  regionId: true,
});
