import { json, type SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { normalizeRoutePermission } from "#app/permissions/normalize-route-permission";
import {
  ModelPermission,
  Permission,
  RoutePermission
} from "#app/permissions/permission.types";
import { type loader as rootLoader } from "#app/root.tsx";
import { prisma } from "#app/utils/db.server";

type UserType = SerializeFrom<typeof rootLoader>["user"];

function isUser(user: UserType): user is UserType {
  if (user === null) {
    return false;
  }

  return user && typeof user === "object" && typeof user.id === "string";
}

export function useOptionalUser() {
  const data = useRouteLoaderData<typeof rootLoader>("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }

  return data.user;
}

export function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }

  return maybeUser;
}

export function userHasRole(
  user: Pick<ReturnType<typeof useUser>, "roles"> | null,
  role: string | string[]
) {
  if (!user) return false;

  role = Array.isArray(role) ? role : [role];

  return user.roles.some((r) => role.includes(r.name));
}

/**
 * Internal function for checking all permissions, regardless of type
 *
 * Please note: own-check executed by calling userHasRoutePermission() or userHasModelPermission()
 */
function userHasPermission(
  user: Pick<ReturnType<typeof useUser>, "roles" | "id"> | null,
  permission: Pick<Permission, "resource" | "action" | "scope" | "resourceId">
) {
  if (!user) return false;

  // console.log("Checking permission", { ...permission, user: user.id });

  return user.roles.some((role) =>
    role.permissions.some(
      (p) =>
        p.resource === permission.resource &&
        p.action === permission.action &&
        p.scope === permission.scope
    )
  );
}

/**
 * Helper function for checking route permissions.
 */
export function userHasRoutePermission(
  user: Pick<ReturnType<typeof useUser>, "roles" | "id"> | null,
  permission: Pick<RoutePermission, "resource" | "scope">
) {
  return userHasPermission(
    user,
    normalizeRoutePermission({ ...permission, action: "access" }) // sets resourceId property
  );
}

/**
 * Helper function for checking model permissions.
 */
export async function userHasModelPermission(
  user: Pick<ReturnType<typeof useUser>, "roles" | "id"> | null,
  permission: Pick<
    ModelPermission,
    "resource" | "action" | "scope" | "resourceId"
  >
) {
  if (permission.scope === "own") {
    if (!(await userHasOwnPermission(user, permission as Permission))) {
      throw json(null, { status: 403, statusText: `Forbidden` });
    }
  }

  return userHasPermission(user, {
    ...permission,
    resourceId: permission.resourceId
  });
}

/**
 * Checks if user is owner of requested permission.resource.
 */
export async function userHasOwnPermission(
  user: Pick<ReturnType<typeof useUser>, "id"> | null,
  permission: Pick<Permission, "resource" | "action" | "scope" | "resourceId">
) {
  invariant(user, "userHasOwnPermission() requires a user");

  // do not query for User table because it does not have `createdBy` field
  if (permission.resource === "user") {
    return permission.resourceId === user.id;
  }

  // @ts-expect-error: No typing for variable as table name (https://github.com/prisma/prisma/issues/11940)
  return prisma[permission.resource].findUnique({
    select: { id: true },
    where: { id: permission.resourceId, createdBy: user.id }
  });
}
