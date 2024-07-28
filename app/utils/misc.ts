import { parseWithZod } from "@conform-to/zod";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { extendTailwindMerge } from "tailwind-merge";
import { z } from "zod";

import { Intent, validateFormIntent } from "#app/validations/form-intent";

import { extendedTheme } from "./extended-theme";

function formatColors() {
  const colors = [];
  for (const [key, color] of Object.entries(extendedTheme.colors)) {
    if (typeof color === "string") {
      colors.push(key);
    } else {
      const colorGroup = Object.keys(color).map((subKey) =>
        subKey === "DEFAULT" ? "" : subKey,
      );
      colors.push({ [key]: colorGroup });
    }
  }
  return colors;
}

const customTwMerge = extendTailwindMerge<string, string>({
  extend: {
    theme: {
      colors: formatColors(),
      borderRadius: Object.keys(extendedTheme.borderRadius),
    },
    classGroups: {
      "font-size": [
        {
          text: Object.keys(extendedTheme.fontSize),
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

/**
 * This method is "borrowed" from https://github.com/icd2k3/use-react-router-breadcrumbs.
 * as an alternative for the (bundle size of the) humanize-string package.
 */
export const humanize = (str: string): string => str
  .replace(/^[\s_]+|[\s_]+$/g, '')
  .replace(/[-_\s]+/g, ' ')
  .replace(/^[a-z]/, (m) => m.toUpperCase());

export function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  console.error("Unable to get error message for error", error);
  return "Unknown Error";
}

export function timeStampToHuman(timestamp: string) {
  return dayjs(timestamp).format("YYYY-MM-DD, HH:mm");
}

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
