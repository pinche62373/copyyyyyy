import { json } from "@remix-run/node";

import {
  modelPermissions,
  routePermissions,
} from "#app/utils/rbac.permissions";
import type {
  ModelPermission,
  ModelPermissionFunctionArgs,
  RoutePermission,
  RoutePermissionFunctionArgs,
} from "#app/utils/rbac.types";
import { cuid } from "#prisma/seed/utils";

import { requireUserId } from "./auth.server.ts";
import { prisma } from "./db.server.ts";

// ----------------------------------------------------------------------------
// Throw 403 unless user has specific permission.
// ----------------------------------------------------------------------------
export async function requireUserWithRole(
  request: Request,
  name: string | string[],
) {
  const userId = await requireUserId(request);

  name = Array.isArray(name) ? name : [name];

  const user = await prisma.user.findFirst({
    select: { id: true },
    where: { id: userId, roles: { some: { name: { in: name } } } },
  });
  if (!user) {
    throw json(
      {
        error: "Unauthorized",
        requiredRole: name,
        message: `Unauthorized: required role: ${name}`,
      },
      { status: 403 },
    );
  }
  return user.id;
}

// ----------------------------------------------------------------------------
// Returns a list of all (Model and Route) Permissions.
// ----------------------------------------------------------------------------
export const getAllPermissions = (): ModelPermission[] & RoutePermission[] => {
  const result: ModelPermission[] & RoutePermission[] = [];

  modelPermissions.forEach((permission) => {
    generateModelPermissions(permission).forEach((generatedPermission) => {
      if (isDuplicatePermission(result, generatedPermission)) {
        throw new Error(
          `Remix permission store already contains model permission: ${JSON.stringify(generatedPermission, null, 2)}`,
        );
      }

      result.push(generatedPermission);
    });
  });

  routePermissions.forEach((permission) => {
    generateRoutePermissions(permission).forEach((generatedPermission) => {
      if (isDuplicatePermission(result, generatedPermission)) {
        throw new Error(
          `Remix permission store already contains route permission: ${JSON.stringify(generatedPermission, null, 2)}`,
        );
      }

      result.push(generatedPermission);
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
    id: cuid(permission.entity + permission.action + permission.access),
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
  access = "own",
  description,
}: ModelPermissionFunctionArgs): ModelPermission[] => {
  actions = Array.isArray(actions) ? actions : [actions];
  roles = Array.isArray(roles) ? roles : [roles];

  const result = [];

  for (const action of actions) {
    result.push({
      entity,
      action,
      access,
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
  roles,
  description,
}: RoutePermissionFunctionArgs): RoutePermission[] => {
  roles = Array.isArray(roles) ? roles : [roles];

  return [
    {
      entity,
      action: "access",
      access: null,
      description,
      roles,
    },
  ];
};

// ----------------------------------------------------------------------------
// Helper function to throw error if permission already exists in the store.
// ----------------------------------------------------------------------------
const isDuplicatePermission = (
  store: ModelPermission[] & RoutePermission[],
  permission: ModelPermission | RoutePermission,
) => {
  const result =
    store.find(
      (p) =>
        p.entity === permission.entity &&
        p.action === permission.action &&
        p.access === permission.access,
    ) !== undefined;
  return result;
};
