import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().cuid2(),
  email: z
    .string()
    .min(1, "This field is required")
    .email("Please provide a valid email address"),
  username: z
    .string()
    .min(3, "This field must be at least 3 characters")
    .max(25, "This field cannot be more than 25 characters"),
  password: z
    .string()
    .min(1, "This field is required")
    .min(6, "This field must be at least 6 characters"),
});

export const UserSchemaLogin = z.object({
  intent: z.literal("login"),
  user: UserSchema.pick({
    email: true,
    password: true,
  }),
});

export const UserSchemaRegister = z.object({
  intent: z.literal("register"),
  user: UserSchema.pick({
    email: true,
    username: true,
    password: true,
  }),
});

export const UserSchemaUpdateAccount = z.object({
  intent: z.literal("update"),
  user: UserSchema.pick({
    id: true,
    username: true,
  }),
});
