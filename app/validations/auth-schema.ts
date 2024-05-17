import { z } from "zod";

import { userSchema } from "./user-schema";

export const authRegisterSchema = userSchema.pick({
  email: true,
  password: true,
});

export const authLoginSchema = userSchema.pick({
  email: true,
  password: true,
});

export type AuthRegisterSchemaType = z.infer<typeof authRegisterSchema>;

export type AuthLoginSchema = z.infer<typeof authLoginSchema>;
