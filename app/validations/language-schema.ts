//
// Regex used here => Capitalized Latin words, separated by spaces, no diacritics (https://regex101.com/r/lTm7Df/1)
// Variation => capitalized Unicode words, separated by spaces, allows diacritics (https://regex101.com/r/iY7iJ6/2)
//
import { z } from "zod";

import { UserSchema } from "#app/validations/user-schema";

export const LanguageSchema = z.object({
  id: z.string().cuid2(),
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

export const LanguageSchemaAdminTable = LanguageSchema.pick({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
});

export const LanguageSchemaCreate = z.object({
  intent: z.literal("create"),
  language: LanguageSchema.pick({
    name: true,
  }),
});

export const LanguageSchemaUpdate = z.object({
  intent: z.literal("update"),
  language: LanguageSchema.pick({
    id: true,
    name: true,
  }),
});

export const LanguageSchemaDelete = z.object({
  intent: z.literal("delete"),
  language: LanguageSchema.pick({
    id: true,
  }),
});
