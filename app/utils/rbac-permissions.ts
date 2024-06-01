import { cuid } from "#prisma/seed/utils";

export const actions = ["create", "read", "update", "delete"] as const;
export const entities = ["country", "language", "region", "user"] as const;
export const accesses = ["own", "any"] as const;

/**
 * Returns an array with all RBAC permissions
 */
export const getAllPermissions = () => {
  const result = [];

  for (const entity of entities) {
    for (const action of actions) {
      for (const access of accesses) {
        result.push({
          entity,
          action,
          access,
        });
      }
    }
  }

  return result;
};

/**
 * Adds a deterministic id to each RBAC permission for seeding purposes
 */
export const getAllSeedPermissions = () => {
  const permissions = getAllPermissions();

  const result = permissions.map((permission) => ({
    ...permission,
    id: cuid(permission.entity + permission.action + permission.access),
  }));

  return result;
};
