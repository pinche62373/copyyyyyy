import type {
  RoutePermissionFunctionArgs,
  ModelPermissionFunctionArgs,
} from "#app/permissions/permission.types";
import { C, D, U } from "#app/permissions/permission.types";
import { Roles } from "#app/validations/role-schema";

// ----------------------------------------------------------------------------
// MODEL PERMISSIONS
// ----------------------------------------------------------------------------
export const modelPermissions: ModelPermissionFunctionArgs[] = [
  {
    resource: "region",
    actions: [C, U, D],
    roles: Roles.ADMIN,
    scope: "any",
  },
];

// ----------------------------------------------------------------------------
// ROUTE PERMISSIONS
// ----------------------------------------------------------------------------
export const routePermissions: RoutePermissionFunctionArgs[] = [
  {
    resource: "/admin/regions",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    resource: "/admin/regions/view",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    resource: "/admin/regions/edit",
    roles: Roles.ADMIN,
    scope: "any",
  },
  {
    resource: "/admin/regions/new",
    roles: Roles.ADMIN,
    scope: "any",
  },
];
