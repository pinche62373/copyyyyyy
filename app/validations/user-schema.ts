import { z } from "zod";

export const userSchema = z.object({
  id: z.string().cuid2(),
  email: z.string().email(),
  username: z
    .string()
    .min(3, "This field must be at least 3 characters")
    .max(25, "This field cannot be more than 25 characters"),
  password: z.string().min(6, "This field must be at least 6 characters"),
});

export const userSchemaLogin = z.object({
  intent: z.literal("login"),
  user: userSchema.pick({
    email: true,
    password: true,
  }),
});

export const userSchemaRegister = z.object({
  intent: z.literal("register"),
  user: userSchema.pick({
    email: true,
    username: true,
    password: true,
  }),
});

export const userSchemaUpdateAccount = z.object({
  intent: z.literal("update"),
  user: userSchema.pick({
    id: true,
    username: true,
  }),
});
