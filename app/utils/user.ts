import { type SerializeFrom } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";

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
