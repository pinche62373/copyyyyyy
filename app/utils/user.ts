import { type SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";

import { normalizeRoutePermission } from "#app/permissions/normalize-route-permission";
import {
  ModelPermission,
  Permission,
  RoutePermission,
} from "#app/permissions/permission.types";
import { type loader as rootLoader } from "#app/root.tsx";

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
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }

  return maybeUser;
}

export function userHasRole(
  user: Pick<ReturnType<typeof useUser>, "roles"> | null,
  role: string | string[],
) {
  if (!user) return false;

  role = Array.isArray(role) ? role : [role];

  return user.roles.some((r) => role.includes(r.name));
}

/**
 * Internal function for checking all permissions, regardless of type
 */
function userHasPermission(
  user: Pick<ReturnType<typeof useUser>, "roles" | "id"> | null,
  permission: Pick<Permission, "resource" | "action" | "scope" | "recordId">,
) {
  if (!user) return false;

  console.log("Checking permission", { ...permission, user: user.id });

  if (permission.scope === "own" && permission.recordId === null) {
    throw new Error(
      "Permission scope is 'own' but recordId is null. " +
        JSON.stringify({ ...permission, user: user.id }, null, 2),
    );
  }

  if (permission.scope === "any") {
    return user.roles.some((role) =>
      role.permissions.some(
        (p) =>
          p.resource === permission.resource &&
          p.action === permission.action &&
          p.scope === permission.scope,
      ),
    );
  }

  // TODO check record owner, then same check as above.
  console.log("TODO => IMPLEMENT SUPPORT FOR PERMISSION SCOPE 'OWN'");
}

/**
 * Helper function for checking route permissions.
 */
export function userHasRoutePermission(
  user: Pick<ReturnType<typeof useUser>, "roles" | "id"> | null,
  permission: Pick<RoutePermission, "resource" | "scope">,
) {
  return userHasPermission(
    user,
    normalizeRoutePermission({ ...permission, action: "access" }), // sets recordId property
  );
}

/**
 * Helper function for checking model permissions.
 */
export function userHasModelPermission(
  user: Pick<ReturnType<typeof useUser>, "roles" | "id"> | null,
  permission: Pick<
    ModelPermission,
    "resource" | "action" | "scope" | "recordId"
  >,
) {
  const recordId = permission.recordId || null;

  return userHasPermission(user, {
    ...permission,
    recordId,
  });
}
