//
// If @snaplet/seed import gives errors, run `npm run postmigrate`.
//
import { copycat } from "@snaplet/copycat";
import type { Store, permissionScalars, roleScalars } from "@snaplet/seed";
import invariant from "tiny-invariant";
import * as Constants from "#app/utils/constants";

/**
 * Generates a deterministic cuid "like" id.
 */
export const cuid = (
  input: string,
  options: { length?: number } = { length: Constants.CUID_LENGTH },
) => {
  const length = options.length || Constants.CUID_LENGTH; // Length of the desired cuid

  return copycat.someOf(input, [length, length], alphaNumAlphabet).join("");
};

const alphaNumAlphabet = Array.from({ length: 36 }, (_x, i) =>
  i < 10 ? String(i) : String.fromCharCode(i + 87),
);

/**
 * Generates a deterministic tzbd-specific permalink
 */
export const permaLink = (name: string) => {
  return "Z" + cuid(name, { length: 5 }).toUpperCase();
};

/**
 * Returns an RBAC role from the seeding $store if name matches.
 */
interface FindRoleProps {
  store: Store;
  name: string;
}

export const findRbacRole = ({ store, name }: FindRoleProps): roleScalars => {
  const result = store.role.find((role) => role.name === name);

  invariant(result, `Store does not contain a Role named ${name}`);

  return result;
};

/**
 * Returns an RBAC permission from the seeding $store if given field name has matching value.
 */
interface FindPermissionsProps {
  store: Store;
  field: string;
  value: string;
}
export const findRbacPermissions = ({
  store,
  field,
  value,
}: FindPermissionsProps): permissionScalars[] => {
  const result = store.permission.filter(
    (permission) => permission[field as keyof permissionScalars] === value,
  );

  invariant(
    result,
    `Store does not contain Permissions with field '${field}' and value '${value}'`,
  );

  return result;
};
