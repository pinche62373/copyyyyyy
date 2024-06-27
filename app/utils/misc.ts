import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { extendTailwindMerge } from "tailwind-merge";
import { ZodRawShape, z } from "zod";

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

// throw a 400 unless page `id` parameter passed zod validation
export function getPageId(
  id: string | undefined,
  schema: z.ZodObject<ZodRawShape>,
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
