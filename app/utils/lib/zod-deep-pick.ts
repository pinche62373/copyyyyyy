/**
 * Pick nested zod properties using deeply.dotted.notation.
 *
 * @see {@link https://github.com/colinhacks/zod/discussions/2083#discussioncomment-6377426}
 */

import { ZodAny, z } from "zod";

function isZodObject(schema: z.ZodTypeAny): schema is z.AnyZodObject {
  if (schema._def.typeName === "ZodObject") return true;

  return false;
}

function isZodArray(schema: z.ZodTypeAny): schema is z.ZodArray<ZodAny> {
  if (schema._def.typeName === "ZodArray") return true;

  return false;
}

function pickObject(schema: z.ZodTypeAny, path: string): z.ZodTypeAny {
  if (!isZodObject(schema)) throw Error("Not a zod object");

  const newSchema = schema.shape?.[path];
  if (!newSchema)
    throw Error(
      `${path} does not exist on schema with keys: ${Object.keys(schema.shape)}`,
    );

  return newSchema;
}

function pickArray(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (!isZodArray(schema)) throw Error("Not a Zod Array");

  const newSchema = schema?.element;
  if (!newSchema) throw Error("No element on Zod Array");

  return newSchema;
}

export function zodDeepPick(
  schema: z.ZodTypeAny,
  propertyPath: string,
): z.ZodTypeAny {
  if (propertyPath === "") return schema;

  const numberRegex = new RegExp("[[0-9]+]");

  const arrayIndex = propertyPath.search(numberRegex);
  const objectIndex = propertyPath.indexOf(".");

  const matchedArray = arrayIndex !== -1;
  const matchedObject = objectIndex !== -1;

  if (
    (matchedArray && matchedObject && arrayIndex < objectIndex) ||
    (matchedArray && !matchedObject)
  ) {
    const arraySplit = propertyPath.split(numberRegex);
    const restArray = arraySplit.slice(1, arraySplit.length).join("[0]");

    if (arrayIndex !== 0) {
      return zodDeepPick(pickObject(schema, arraySplit[0]), `[0]${restArray}`);
    }

    return zodDeepPick(
      pickArray(schema),
      restArray.charAt(0) === "."
        ? restArray.slice(1, restArray.length)
        : restArray,
    );
  }

  if (matchedObject) {
    const objectSplit = propertyPath.split(".");
    const restObject = objectSplit.slice(1, objectSplit.length).join(".");

    return zodDeepPick(pickObject(schema, objectSplit[0]), restObject);
  }

  return pickObject(schema, propertyPath);
}
