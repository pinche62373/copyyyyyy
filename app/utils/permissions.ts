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
    entity: "language",
    actions: [C, R, U, D],
    roles: [ADMIN, MOD],
    scope: "any",
  },
  {
    entity: "language",
    actions: R,
    roles: USER,
    scope: "own",
  },
  //   {
  //     entity: "language", // Test case: error should be thrown because entity, action, scope combi already exists
  //     actions: R,
  //     roles: MOD,
  //   },
  {
    entity: "language", // Test case: should throw an error because ADMIN has role membership for two "delete" actions
    actions: D,
    roles: ADMIN,
    scope: "own",
  },
];

// ----------------------------------------------------------------------------
// ROUTE PERMISSIONS
// ----------------------------------------------------------------------------
export const routePermissions: RoutePermissionFunctionArgs[] = [
  {
    entity: "/admin",
    roles: [ADMIN, MOD],
    scope: "any",
  },
  // {
  //   entity: "/admin", // TEST case: should throw an error because ADMIN route already added
  //   roles: ADMIN,
  // },
  {
    entity: "/admin/system",
    roles: ADMIN,
    scope: "any",
  },
];
