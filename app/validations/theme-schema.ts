import { z } from "zod";

const ThemeSchema = z.object({
  theme: z.enum(["system", "light", "dark"]),
});

export const ThemeSchemaSwitch = z.object({
  intent: z.literal("update"),
  theme: ThemeSchema.shape.theme,
  redirectTo: z.string().optional(),
});
