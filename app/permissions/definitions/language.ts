import type {
  RoutePermissionFunctionArgs,
  ModelPermissionFunctionArgs,
} from "#app/permissions/permission.types";
import { Roles } from "#app/validations/role-schema";

const C = "create";
const U = "update";
const D = "delete";

// ----------------------------------------------------------------------------
// MODEL PERMISSIONS
// ----------------------------------------------------------------------------
export const modelPermissions: ModelPermissionFunctionArgs[] = [
  {
    resource: "language",
    actions: [C, U],
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    resource: "language",
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
    resource: "/admin/languages",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    resource: "/admin/languages/view",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    resource: "/admin/languages/edit",
    roles: Roles.ADMIN,
    scope: "any",
  },
  {
    resource: "/admin/languages/new",
    roles: Roles.ADMIN,
    scope: "any",
  },
];
