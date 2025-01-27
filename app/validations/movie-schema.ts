import { z } from "zod";

export const permalink = z
  .string()
  .length(6)
  .regex(/^Z([A-Z0-9]{5})$/, {
    message:
      "Movie permalink must start Z followed by 5 uppercase characters and/or numbers.",
  });

export const MovieSchema = z.object({
  id: z.string(),
  name: z.string(),
  permalink: permalink,
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
});

export const MovieSchemaPermaLink = MovieSchema.pick({
  id: true,
  permalink: true,
});
