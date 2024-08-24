//@ts-expect-error Because JsonifyObject is not exported
import { type JsonifyObject } from "@remix-run/server-runtime/dist/jsonify";
import { ValidationErrorResponseData, ValidatorError } from "@rvf/core";

/**
 * Checks if the passed JSON response contains a RVF validation error.
 */
export const isValidationErrorResponse = <T>(
  response: T | ValidationErrorResponseData,
): response is JsonifyObject<ValidatorError> =>
  typeof response === "object" &&
  response !== null &&
  "fieldErrors" in response;
