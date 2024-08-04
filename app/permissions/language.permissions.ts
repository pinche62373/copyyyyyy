import type {
  RoutePermissionFunctionArgs,
  ModelPermissionFunctionArgs,
} from "#app/utils/permissions.types";
import { Roles } from "#app/validations/role-schema";

const C = "create";
const U = "update";
const D = "delete";

// ----------------------------------------------------------------------------
// MODEL PERMISSIONS
// ----------------------------------------------------------------------------
export const modelPermissions: ModelPermissionFunctionArgs[] = [
  {
    entity: "language",
    actions: [C, U],
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    entity: "language",
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
    entity: "/admin/languages",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    entity: "/admin/languages/view",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    entity: "/admin/languages/edit",
    roles: Roles.ADMIN,
    scope: "any",
  },
  {
    entity: "/admin/languages/new",
    roles: Roles.ADMIN,
    scope: "any",
  },
];
