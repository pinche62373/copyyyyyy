// unions
const roles = ["admin", "moderator", "user"] as const;

const modelEntities = ["country", "language", "region", "user"] as const;
const modelActions = ["create", "read", "update", "delete"] as const;
const modelAccesses = ["own", "any"] as const;

const routeEntities = ["admin", "admin/system"];
const routeActions = ["access"] as const;

export interface RoutePermission {
  entity: (typeof routeEntities)[number];
  action: (typeof routeActions)[number];
  access: null;
  description?: string;
  roles: (typeof roles)[number] | (typeof roles)[number][];
}

export interface RoutePermissionFunctionArgs {
  entity: (typeof routeEntities)[number];
  description?: string;
  roles: (typeof roles)[number] | (typeof roles)[number][];
}

export interface ModelPermission {
  entity: (typeof modelEntities)[number];
  action: (typeof modelActions)[number];
  access: (typeof modelAccesses)[number];
  description?: string;
  roles: (typeof roles)[number] | (typeof roles)[number][];
}

export interface ModelPermissionFunctionArgs {
  entity: (typeof modelEntities)[number];
  actions: (typeof modelActions)[number] | (typeof modelActions)[number][];
  access: (typeof modelAccesses)[number];
  description?: string;
  roles: (typeof roles)[number] | (typeof roles)[number][];
}
