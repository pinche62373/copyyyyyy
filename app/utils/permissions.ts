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
  {
    entity: "region",
    actions: [C, U, D],
    roles: Roles.ADMIN,
    scope: "any",
  },

  // TODO: create testcases
  // - throw error when entity, action, scope combi already exists
  // - throw error when role is assigned two idenitical actions
];

// ----------------------------------------------------------------------------
// ROUTE PERMISSIONS
// ----------------------------------------------------------------------------
export const routePermissions: RoutePermissionFunctionArgs[] = [
  // Roles.ADMIN DASHBOARD
  {
    entity: "/admin",
    roles: [Roles.ADMIN, Roles.MODERATOR],
    scope: "any",
  },
  // COUNTRIES
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
  // LANGUAGES
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

  // --------------------------------------------------------------------------
  // RBAC STARTING BELOW
  // --------------------------------------------------------------------------
  // ENTITIES
  {
    entity: "/admin/rbac/entities/view",
    roles: Roles.ADMIN,
    scope: "any",
  },
  // ROLES
  {
    entity: "/admin/rbac/roles",
    roles: Roles.ADMIN,
    scope: "any",
  },
  {
    entity: "/admin/rbac/roles/view",
    roles: Roles.ADMIN,
    scope: "any",
  },
  // PERMISSIONS
  {
    entity: "/admin/rbac/permissions",
    roles: Roles.ADMIN,
    scope: "any",
  },
  // --------------------------------------------------------------------------
  // RBAC ENDING ABOVE
  // --------------------------------------------------------------------------

  // REGIONS
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
  // SYSTEM
  {
    entity: "/admin/system",
    roles: Roles.ADMIN,
    scope: "any",
  },

  // TODO: create testcases
  // - throw error when a ROUTE is already added
];
