import { Role } from "#app/validations/role-schema";

// consts as used in the permission definitions
export const C = "create" as const
export const U = "update" as const
export const D = "delete" as const

// consts as used by the exported interfaces below
const routeActions = ["access"] as const;
const routeScopes = ["own", "any"] as const;

const modelActions = ["create", "update", "delete"] as const;
const modelScopes = ["own", "any"] as const;

export interface Permission {
  id: string;
  resource: string;
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
  resource: string;
  action: (typeof routeActions)[number];
  scope: (typeof routeScopes)[number];
  description?: string;
  roles: Role[number] | Role[number][];
}

export interface RoutePermissionFunctionArgs {
  resource: string;
  scope: (typeof routeScopes)[number];
  description?: string;
  roles: Role[number] | Role[number][];
}

export interface ModelPermission {
  resource: string;
  action: (typeof modelActions)[number];
  scope: (typeof modelScopes)[number];
  description?: string;
  roles: Role[number] | Role[number][];
}

export interface ModelPermissionFunctionArgs {
  resource: string;
  actions: (typeof modelActions)[number] | (typeof modelActions)[number][];
  scope: (typeof modelScopes)[number];
  description?: string;
  roles: Role[number] | Role[number][];
}
