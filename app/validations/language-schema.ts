import { z } from "zod";

export const languageSchema = z.object({
  name: z.string({ required_error: 'Language name is required' }),
});
