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
    entity: "region",
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
    entity: "/admin/regions",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    entity: "/admin/regions/view",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    entity: "/admin/regions/edit",
    roles: Roles.ADMIN,
    scope: "any",
  },
  {
    entity: "/admin/regions/new",
    roles: Roles.ADMIN,
    scope: "any",
  },
];
