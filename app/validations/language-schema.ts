import { z } from "zod";

export const languageSchema = z.object({
  name: z
    .string({ required_error: 'Language name is required' })
    .regex(/^\p{Lu}\p{Ll}+( \p{Lu}\p{Ll}+)*$/, { message: 'Language names must start with a capital letter, separated by a single whitespace.' })
});
