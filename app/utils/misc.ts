import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";

import { Intent, validateFormIntent } from "#app/validations/form-intent";

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

  if (!schema.pick({ id: true }).safeParse({ id }).success) {
    throw new Response("Bad Request", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  return id;
}

// throw 422 Unprocessable Entity unless formData passed zod validation and intent
interface validateSubmissionFunctionArgs {
  intent: Intent;
  formData: FormData;
  schema: z.ZodSchema;
}

export function validateSubmission({
  intent,
  formData,
  schema,
}: validateSubmissionFunctionArgs) {
  validateFormIntent({ formData, intent }); // TODO: refactor into named args

  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== "success") {
    throw new Response("Unprocessable Entity", {
      status: 422,
      statusText: "Unprocessable Entity",
    });
  }

  return submission;
}
