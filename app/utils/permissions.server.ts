import { data } from "react-router";

import { getPermissions } from "#app/models/permission.server";
import { getAllPermissions } from "#app/permissions/get-all-permissions";
import type {
  FlatPermission,
  ModelPermission,
  ModelPermissionFunctionArgs,
  Permission,
  RoutePermission,
  RoutePermissionFunctionArgs,
} from "#app/permissions/permission.types";
import { getUser, requireUserId } from "#app/utils/auth.server";
import { prisma } from "#app/utils/db.server";
import {
  userHasModelPermission,
  userHasRoutePermission,
} from "#app/utils/user";
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
    throw data(null, { status: 403, statusText: "Forbidden" });
  }
  return user.id;
}

// ----------------------------------------------------------------------------
// Throw 403 unless user has role with permission to access the route.
// ----------------------------------------------------------------------------
export async function requireRoutePermission(
  request: Request,
  permission: Pick<RoutePermission, "resource" | "scope">,
) {
  const user = await getUser(request);

  // TODO RR7
  if (!userHasRoutePermission(user, permission)) {
    throw data(null, { status: 403, statusText: "Forbidden" });
  }

  return true;
}

// ----------------------------------------------------------------------------
// Throw 403 unless user has role with permission for the model action.
// ----------------------------------------------------------------------------
export async function requireModelPermission(
  request: Request,
  permission: Pick<
    ModelPermission,
    "resource" | "action" | "scope" | "resourceId"
  >,
) {
  const user = await getUser(request);

  if ((await userHasModelPermission(user, permission)) === null) {
    throw data(null, { status: 403, statusText: "Forbidden" });
  }

  return true;
}

// ----------------------------------------------------------------------------
// Add a deterministic id to each RBAC permission for seeding purposes.
// ----------------------------------------------------------------------------
export const getSeedPermissions = () => {
  const permissions = getAllPermissions();

  const result = permissions.map((permission) => ({
    ...permission,
    id: cuid(permission.resource + permission.action + permission.scope),
    updatedAt: null,
  }));

  return result;
};

// ----------------------------------------------------------------------------
// Helper function to generate ModelPermission objects.
// ----------------------------------------------------------------------------
export const generateModelPermissions = ({
  resource,
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
      resource,
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
export const generateRoutePermissions = ({
  resource,
  scope,
  roles,
  description,
}: RoutePermissionFunctionArgs): RoutePermission[] => {
  roles = Array.isArray(roles) ? roles : [roles];

  return [
    {
      resource,
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
export const isDuplicatePermission = (
  store: Permission[],
  permission: ModelPermission | RoutePermission,
) => {
  const result =
    store.find(
      (p) =>
        p.resource === permission.resource &&
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
type FlattenPermissionsArg = ReturnType<typeof getPermissions> extends Promise<
  infer T
>
  ? T
  : never;

export const flattenPermissions = (permissions: FlattenPermissionsArg) => {
  const result: FlatPermission[] = [];

  permissions.forEach((permission) => {
    permission.roles.forEach((role) => {
      const { roles, ...otherProps } = permission; // roles prop deleted here

      const temp = { ...otherProps, role: role.name, roleId: role.id }; // add role prop

      result.push(temp as unknown as FlatPermission);
    });
  });

  return result;
};
