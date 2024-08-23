import { z } from "zod";

export const userSchema = z.object({
  id: z.string().cuid2(),
  email: z.string().email(),
  username: z.string(), // TODO determine length + allowed characters
  password: z.string().min(6, "Must contain at least 6 chars"),
});

export const userSchemaUpdateUsername = userSchema.pick({
  id: true,
  username: true,
});

export const userSchemaUpdateEmail = userSchema.pick({
  id: true,
  email: true,
});
