import type {
  ModelPermissionFunctionArgs,
  RoutePermissionFunctionArgs,
} from "#app/permissions/permission.types";
import { U } from "#app/permissions/permission.types";
import { Roles } from "#app/validations/role-schema";

// ----------------------------------------------------------------------------
// MODEL PERMISSIONS
// ----------------------------------------------------------------------------
export const modelPermissions: ModelPermissionFunctionArgs[] = [
  {
    resource: "user",
    actions: [U],
    roles: [Roles.ADMIN, Roles.MODERATOR, Roles.USER],
    scope: "own",
  },
];

// ----------------------------------------------------------------------------
// ROUTE PERMISSIONS
// ----------------------------------------------------------------------------
export const routePermissions: RoutePermissionFunctionArgs[] = [
  {
    resource: "/user/collection",
    roles: [Roles.ADMIN, Roles.MODERATOR, Roles.USER],
    scope: "any", // no need for own because the route only fetches authenticated user data
  },
  {
    resource: "/user/likes",
    roles: [Roles.ADMIN, Roles.MODERATOR, Roles.USER],
    scope: "any",
  },
  {
    resource: "/user/settings",
    roles: [Roles.ADMIN, Roles.MODERATOR, Roles.USER],
    scope: "any",
  },
];
