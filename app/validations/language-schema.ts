//
// Regex used here => Capitalized Latin words, separated by spaces, no diacritics (https://regex101.com/r/lTm7Df/1)
// Variation => capitalized Unicode words, separated by spaces, allows diacritics (https://regex101.com/r/iY7iJ6/2)
//
import { z } from "zod";

export const languageSchema = z.object({
  name: z
    .string({ required_error: 'Language name is required' })
    .regex(/^[A-Z][a-z]+( [A-Z][a-z]+)*$/, { message: 'This field only allows capitalized Latin words, separated by spaces.' })
});
