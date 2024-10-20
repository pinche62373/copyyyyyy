import { z } from "zod";

export const userSchema = z.object({
  id: z.string().cuid2(),
  email: z.string().email(),
  username: z
    .string()
    .min(3, "Must be at least 3 characters")
    .max(25, "Cannot be more than 25 characters"),
  password: z.string().min(6, "Must be at least 6 characters")
});

export const userSchemaUpdateAccount = z.object({
  intent: z.literal("update"),
  user: userSchema.pick({
    id: true,
    username: true
  })
});
