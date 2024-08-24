import { z } from "zod";

export const userSchema = z.object({
  id: z.string().cuid2(),
  email: z.string().email(),
  username: z
    .string()
    .min(3, "Must be at least 3 characters")
    .max(25, "Cannot be more than 25 characters"),
  password: z.string().min(6, "Must be at least 6 characters"),
});

export const userSchemaUpdateUsername = userSchema
  .pick({
    id: true,
    username: true,
  })
  .extend({
    intent: z.literal("update"),
  });

export const userSchemaUpdateEmail = userSchema
  .pick({
    id: true,
    email: true,
  })
  .extend({
    intent: z.literal("update"),
  });
