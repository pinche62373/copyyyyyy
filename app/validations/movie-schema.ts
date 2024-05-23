import { z } from "zod";

export const slug = z
  .string()
  .length(6)
  .regex(/^Z([A-Z0-9]{5})$/, {
    message:
      "Movie slug must start Z followed by 5 uppercase characters and/or numbers.",
  });

export const movieSchemaFull = z.object({
  id: z.string(),
  name: z.string(),
  slug: slug,
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
});

export const movieSchemaPermaLink = movieSchemaFull.pick({
  id: true,
  slug: true,
});
