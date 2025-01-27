import type { z } from "zod";

// throw 400 Bad Request unless page `id` parameter passed zod validation
export function validatePageId(
  id: string | undefined,
  schema: z.ZodObject<z.ZodRawShape>,
): string {
  if (!id) {
    throw new Response("Bad Request", {
      status: 400,
      statusText: "Bad Request",
    });
  }
  if (schema.pick({ id: true }).safeParse({ id }).success === false) {
    throw new Response("Bad Request", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  return id;
}
