import { z } from "zod";

export const movieSchema = z.object({
  id: z.string(),
  slug: z.string().length(5),
});
