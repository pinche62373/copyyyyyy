import { Role } from "#app/validations/role-schema";

const routeActions = ["access"] as const;
const routeScopes = ["own", "any"] as const;

const modelActions = ["create", "read", "update", "delete"] as const;
const modelScopes = ["own", "any"] as const;

export interface Permission {
  id: string;
  entity: string;
  action: string;
  scope: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  roles: {
    name: Role[number];
  }[];
}

export interface FlatPermission extends Omit<Permission, "roles"> {
  role: Role[number];
  roleId: string;
}

export interface RoutePermission {
  entity: string;
  action: (typeof routeActions)[number];
  scope: (typeof routeScopes)[number];
  description?: string;
  roles: Role[number] | Role[number][];
}

export interface RoutePermissionFunctionArgs {
  entity: string;
  scope: (typeof routeScopes)[number];
  description?: string;
  roles: Role[number] | Role[number][];
}

export interface ModelPermission {
  entity: string;
  action: (typeof modelActions)[number];
  scope: (typeof modelScopes)[number];
  description?: string;
  roles: Role[number] | Role[number][];
}

export interface ModelPermissionFunctionArgs {
  entity: string;
  actions: (typeof modelActions)[number] | (typeof modelActions)[number][];
  scope: (typeof modelScopes)[number];
  description?: string;
  roles: Role[number] | Role[number][];
}
