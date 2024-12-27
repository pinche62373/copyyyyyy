import { z } from "zod";

export const ThemeSchemaSwitch = z.object({
  intent: z.literal("update"),
  theme: z.enum(["system", "light", "dark"]),
  redirectTo: z.string().optional(),
});
