import { Store, permissionScalars, roleScalars } from "@snaplet/seed";
import invariant from "tiny-invariant";

import { cuid } from "./utils";

const entities = ["user", "language", "region", "country"];
const actions = ["create", "read", "update", "delete"];
const accesses = ["own", "any"] as const;

export const getRbacPermissions = () => {
  const result = [];

  for (const entity of entities) {
    for (const action of actions) {
      for (const access of accesses) {
        result.push({
          id: cuid(entity + action + access),
          entity,
          action,
          access,
        });
      }
    }
  }

  return result;
};

interface FindRoleProps {
  store: Store;
  name: string;
}

export const findRbacRole = ({ store, name }: FindRoleProps): roleScalars => {
  const result = store.role.find((role) => role.name === name);

  invariant(result, `Store does not contain a Role named ${name}`);

  return result;
};

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
