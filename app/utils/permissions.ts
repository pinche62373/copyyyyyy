import type {
  RoutePermissionFunctionArgs,
  ModelPermissionFunctionArgs,
} from "#app/utils/permissions.types";

const C = "create";
const R = "read";
const U = "update";
const D = "delete";

const ADMIN = "admin";
const MOD = "moderator";
const USER = "user";

// ----------------------------------------------------------------------------
// MODEL PERMISSIONS
// ----------------------------------------------------------------------------
export const modelPermissions: ModelPermissionFunctionArgs[] = [
  {
    entity: "country",
    actions: [C, U],
    roles: [ADMIN, MOD],
    scope: "any",
  },
  {
    entity: "country",
    actions: [D],
    roles: [ADMIN],
    scope: "any",
  },
  {
    entity: "language",
    actions: [C, U],
    roles: [ADMIN, MOD],
    scope: "any",
  },
  {
    entity: "language",
    actions: [D],
    roles: [ADMIN],
    scope: "any",
  },
  {
    entity: "region",
    actions: [C, U, D],
    roles: ADMIN,
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
  // ADMIN DASHBOARD
  {
    entity: "/admin",
    roles: [ADMIN, MOD],
    scope: "any",
  },
  // COUNTRIES
  {
    entity: "/admin/countries",
    roles: [ADMIN, MOD],
    scope: "any",
  },
  {
    entity: "/admin/countries/new",
    roles: [ADMIN, MOD],
    scope: "any",
  },
  {
    entity: "/admin/countries/edit",
    roles: [ADMIN, MOD],
    scope: "any",
  },
  // LANGUAGES
  {
    entity: "/admin/languages",
    roles: [ADMIN, MOD],
    scope: "any",
  },
  {
    entity: "/admin/languages/view",
    roles: [ADMIN, MOD],
    scope: "any",
  },
  {
    entity: "/admin/languages/edit",
    roles: [ADMIN, MOD],
    scope: "any",
  },
  {
    entity: "/admin/languages/new",
    roles: [ADMIN, MOD],
    scope: "any",
  },

  // --------------------------------------------------------------------------
  // RBAC STARTING BELOW
  // --------------------------------------------------------------------------
  // ROLES
  {
    entity: "/admin/rbac/roles",
    roles: ADMIN,
    scope: "any",
  },
  {
    entity: "/admin/rbac/roles/view",
    roles: ADMIN,
    scope: "any",
  },
  // PERMISSIONS
  {
    entity: "/admin/rbac/permissions",
    roles: ADMIN,
    scope: "any",
  },
  {
    entity: "/admin/rbac/permissions/entity/view",
    roles: ADMIN,
    scope: "any",
  },
  // --------------------------------------------------------------------------
  // RBAC ENDING ABOVE
  // --------------------------------------------------------------------------

  // REGIONS
  {
    entity: "/admin/regions",
    roles: ADMIN,
    scope: "any",
  },
  {
    entity: "/admin/regions/new",
    roles: ADMIN,
    scope: "any",
  },
  {
    entity: "/admin/regions/edit",
    roles: ADMIN,
    scope: "any",
  },
  // SYSTEM
  {
    entity: "/admin/system",
    roles: ADMIN,
    scope: "any",
  },

  // TODO: create testcases
  // - throw error when a ROUTE is already added
];
