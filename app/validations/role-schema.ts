import { z } from "zod";

export const Roles = {
  ADMIN: "admin" as Role,
  MODERATOR: "moderator" as Role,
  USER: "user" as Role,
};

export type Role = "admin" | "moderator" | "user";

export const RoleSchema = z.object({
  id: z.string().cuid2(),
  name: z.string({ required_error: "Language name is required" }),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export const RoleSchemaAdminTable = RoleSchema.pick({
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
});
