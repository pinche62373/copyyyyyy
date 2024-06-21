// unions
const roles = ["admin", "moderator", "user"] as const;

const modelEntities = ["country", "language", "region", "user"] as const;
const modelActions = ["create", "read", "update", "delete"] as const;
const modelScopes = ["own", "any"] as const;

const routeEntities = ["admin", "admin/system"];
const routeActions = ["access"] as const;
const routeScopes = ["own", "any"] as const;

export interface RoutePermission {
  entity: (typeof routeEntities)[number];
  action: (typeof routeActions)[number];
  scope: (typeof routeScopes)[number];
  description?: string;
  roles: (typeof roles)[number] | (typeof roles)[number][];
}

export interface RoutePermissionFunctionArgs {
  entity: (typeof routeEntities)[number];
  scope: (typeof routeScopes)[number];
  description?: string;
  roles: (typeof roles)[number] | (typeof roles)[number][];
}

export interface ModelPermission {
  entity: (typeof modelEntities)[number];
  action: (typeof modelActions)[number];
  scope: (typeof modelScopes)[number];
  description?: string;
  roles: (typeof roles)[number] | (typeof roles)[number][];
}

export interface ModelPermissionFunctionArgs {
  entity: (typeof modelEntities)[number];
  actions: (typeof modelActions)[number] | (typeof modelActions)[number][];
  scope: (typeof modelScopes)[number];
  description?: string;
  roles: (typeof roles)[number] | (typeof roles)[number][];
}
