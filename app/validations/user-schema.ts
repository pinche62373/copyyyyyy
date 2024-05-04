import { z } from "zod";

export const userSchema = z.object({
  id: z.string().cuid2(),
  email: z.string().email(),
  password: z.string().min(6, "Must contain at least 6 chars"),
});
