import { z } from "zod";

import { userSchema } from "#app/validations/user-schema";

export const authRegisterSchema = userSchema.pick({
  email: true,
  password: true
});

export const authLoginSchema = z.object({
  intent: z.literal("login"),
  user: userSchema.pick({
    email: true,
    password: true
  })
});

export type AuthRegisterSchemaType = z.infer<typeof authRegisterSchema>;

export type AuthLoginSchema = z.infer<typeof authLoginSchema>;
