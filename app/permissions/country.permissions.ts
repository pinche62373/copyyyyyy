import type {
  RoutePermissionFunctionArgs,
  ModelPermissionFunctionArgs,
} from "#app/utils/permissions.types";
import { Roles } from "#app/validations/role-schema";

// TODO move to file
const C = "create";
const U = "update";
const D = "delete";

// ----------------------------------------------------------------------------
// MODEL PERMISSIONS
// ----------------------------------------------------------------------------
export const modelPermissions: ModelPermissionFunctionArgs[] = [
  {
    entity: "country",
    actions: [C, U],
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    entity: "country",
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
    entity: "/admin/countries",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    entity: "/admin/countries/view",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  {
    entity: "/admin/countries/edit",
    roles: Roles.ADMIN,
    scope: "any",
  },
  {
    entity: "/admin/countries/new",
    roles: Roles.ADMIN,
    scope: "any",
  },
];
