import { json } from "@remix-run/node";

import { getPermissions } from "#app/models/permission.server";
import { getUser, requireUserId } from "#app/utils/auth.server";
import { prisma } from "#app/utils/db.server";
import { modelPermissions, routePermissions } from "#app/utils/permissions";
import type {
  FlatPermission,
  ModelPermission,
  ModelPermissionFunctionArgs,
  Permission,
  RoutePermission,
  RoutePermissionFunctionArgs,
} from "#app/utils/permissions.types";
import { userHasRoutePermission } from "#app/utils/user";
import { Role } from "#app/validations/role-schema";
import { cuid } from "#prisma/seed/seed-utils";

// ----------------------------------------------------------------------------
// Throw 403 unless user has specified role.
// ----------------------------------------------------------------------------
export async function requireRole(request: Request, role: string | string[]) {
  const userId = await requireUserId(request);

  role = Array.isArray(role) ? role : [role];

  const user = await prisma.user.findFirst({
    select: { id: true },
    where: { id: userId, roles: { some: { name: { in: role } } } },
  });
  if (!user) {
    throw json(null, { status: 403, statusText: "Forbidden" });
  }
  return user.id;
}

// ----------------------------------------------------------------------------
// Throw 403 unless user has role with permission to access the route.
// ----------------------------------------------------------------------------
export async function requireRoutePermission(
  request: Request,
  permission: Pick<RoutePermission, "entity" | "scope">,
) {
  const user = await getUser(request);

  if (!userHasRoutePermission(user, permission)) {
    throw json(null, { status: 403, statusText: "Forbidden" });
  }

  return true;
}

// ----------------------------------------------------------------------------
// Returns a list of all (Model and Route) Permissions.
// ----------------------------------------------------------------------------
export const getAllPermissions = (): Permission[] => {
  const result: Permission[] = [];

  modelPermissions.forEach((permission) => {
    generateModelPermissions(permission).forEach((generatedPermission) => {
      if (isDuplicatePermission(result, generatedPermission)) {
        throw new Error(
          `Remix permission store already contains model permission: ${JSON.stringify(generatedPermission, null, 2)}`,
        );
      }

      result.push(generatedPermission as unknown as Permission);
    });
  });

  routePermissions.forEach((permission) => {
    generateRoutePermissions(permission).forEach((generatedPermission) => {
      if (isDuplicatePermission(result, generatedPermission)) {
        throw new Error(
          `Remix permission store already contains route permission: ${JSON.stringify(generatedPermission, null, 2)}`,
        );
      }

      result.push(generatedPermission as unknown as Permission);
    });
  });

  return result;
};

// ----------------------------------------------------------------------------
// Add a deterministic id to each RBAC permission for seeding purposes.
// ----------------------------------------------------------------------------
export const getSeedPermissions = () => {
  const permissions = getAllPermissions();

  const result = permissions.map((permission) => ({
    ...permission,
    id: cuid(permission.entity + permission.action + permission.scope),
  }));

  return result;
};

// ----------------------------------------------------------------------------
// Helper function to generate ModelPermission objects.
// ----------------------------------------------------------------------------
const generateModelPermissions = ({
  entity,
  actions,
  roles,
  scope,
  description,
}: ModelPermissionFunctionArgs): ModelPermission[] => {
  actions = Array.isArray(actions) ? actions : [actions];
  roles = Array.isArray(roles) ? roles : [roles];

  const result = [];

  for (const action of actions) {
    result.push({
      entity,
      action,
      scope,
      description,
      roles,
    });
  }
  return result;
};

// ----------------------------------------------------------------------------
// Helper function to generate RoutePermission objects.
// ----------------------------------------------------------------------------
const generateRoutePermissions = ({
  entity,
  scope,
  roles,
  description,
}: RoutePermissionFunctionArgs): RoutePermission[] => {
  roles = Array.isArray(roles) ? roles : [roles];

  return [
    {
      entity,
      action: "access",
      scope,
      description,
      roles,
    },
  ];
};

// ----------------------------------------------------------------------------
// Helper function to throw error if permission already exists in the seed store.
// ----------------------------------------------------------------------------
const isDuplicatePermission = (
  store: Permission[],
  permission: ModelPermission | RoutePermission,
) => {
  const result =
    store.find(
      (p) =>
        p.entity === permission.entity &&
        p.action === permission.action &&
        p.scope === permission.scope,
    ) !== undefined;
  return result;
};

// ----------------------------------------------------------------------------
// Helper function to extract permissions for the given role.
// ----------------------------------------------------------------------------
export const getPermissionsForRole = (
  permissions: Permission[],
  role: Role,
): Permission[] => {
  const result = permissions.filter((permission) =>
    (permission.roles as unknown as Role[]).includes(role),
  );

  return result;
};

// ----------------------------------------------------------------------------
// Helper function to create a flat list with permissions and roles (as used
// by the UI)
// ----------------------------------------------------------------------------
type FlattenPermissionsArg =
  ReturnType<typeof getPermissions> extends Promise<infer T> ? T : never;

export const flattenPermissions = (permissions: FlattenPermissionsArg) => {
  const result: FlatPermission[] = [];

  permissions.forEach((permission) => {
    permission.roles.forEach((role) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { roles, ...otherProps } = permission; // roles prop deleted here

      const temp = { ...otherProps, role: role.name, roleId: role.id }; // add role prop

      result.push(temp as unknown as FlatPermission);
    });
  });

  return result;
};
