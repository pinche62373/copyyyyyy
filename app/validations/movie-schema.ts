import { z } from "zod";

export const slug = z
  .string()
  .length(6)
  .regex(/^Z([A-Z0-9]{5})$/, {
    message:
      "Movie slug must start Z followed by 5 uppercase characters and/or numbers.",
  });

export const movieSchema = z.object({
  id: z.string(),
  slug: slug,
});
