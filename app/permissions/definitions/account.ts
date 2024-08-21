import type {
  RoutePermissionFunctionArgs,
  ModelPermissionFunctionArgs,
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
    resource: "/account/collection",
    roles: [Roles.ADMIN, Roles.MODERATOR, Roles.USER],
    scope: "any", // no need for own because the route only fetches authenticated user data
  },
  {
    resource: "/account/likes",
    roles: [Roles.ADMIN, Roles.MODERATOR, Roles.USER],
    scope: "any",
  },
  {
    resource: "/account/settings",
    roles: [Roles.ADMIN, Roles.MODERATOR, Roles.USER],
    scope: "any",
  },
];
