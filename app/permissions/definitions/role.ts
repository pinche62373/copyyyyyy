import type {
  ModelPermissionFunctionArgs,
  RoutePermissionFunctionArgs,
} from "#app/permissions/permission.types";
import { Roles } from "#app/validations/role-schema";

// ----------------------------------------------------------------------------
// MODEL PERMISSIONS
// ----------------------------------------------------------------------------
export const modelPermissions: ModelPermissionFunctionArgs[] = [];

// ----------------------------------------------------------------------------
// ROUTE PERMISSIONS
// ----------------------------------------------------------------------------
export const routePermissions: RoutePermissionFunctionArgs[] = [
  {
    resource: "/admin/security/roles",
    roles: Roles.ADMIN,
    scope: "any",
  },
  {
    resource: "/admin/security/roles/view",
    roles: Roles.ADMIN,
    scope: "any",
  },
];
