import type { ZodObject, ZodRawShape } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

/**
 * Get default form values by introspecting zod schema.
 */
type AdditionalProps = {
  [key: string]: string | number;
};

export const getDefaultValues = (
  schema: ZodObject<ZodRawShape>,
  additionalProps?: AdditionalProps,
) => {
  let result = getDefaultsForSchema(schema);

  if (additionalProps === undefined) {
    return result;
  }

  for (const [key, value] of Object.entries(additionalProps)) {
    result[key] = value;
  }

  return result;
};
