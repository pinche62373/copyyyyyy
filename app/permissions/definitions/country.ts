import type {
  ModelPermissionFunctionArgs,
  RoutePermissionFunctionArgs,
} from "#app/permissions/permission.types";
import { C, D, U } from "#app/permissions/permission.types";
import { Roles } from "#app/validations/role-schema";

// ----------------------------------------------------------------------------
// MODEL PERMISSIONS
// ----------------------------------------------------------------------------
export const modelPermissions: ModelPermissionFunctionArgs[] = [
  {
    resource: "country",
    actions: [C, U],
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    resource: "country",
    actions: [D],
    roles: [Roles.ADMIN],
    scope: "any",
  },
];

// ----------------------------------------------------------------------------
// ROUTE PERMISSIONS
// ----------------------------------------------------------------------------
export const routePermissions: RoutePermissionFunctionArgs[] = [
  {
    resource: "/admin/countries",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    resource: "/admin/countries/view",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    resource: "/admin/countries/edit",
    roles: Roles.ADMIN,
    scope: "any",
  },
  {
    resource: "/admin/countries/new",
    roles: Roles.ADMIN,
    scope: "any",
  },
];
