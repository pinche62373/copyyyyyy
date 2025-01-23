import type { Permission } from "#app/permissions/permission.types";

/**
 * This regex creates below named capturing groups for VIEW and EDIT route permissions:
 *  - editPath
 *  - editId
 *  - viewPath
 *  - viewId
 *
 * @see {@link https://regex101.com/r/FUqhQA/1} for regex and test cases.
 */
const groupRoutePermissionWithIdRegex = new RegExp(
  /(?<viewPath>.+)\/(?<viewId>[a-z0-9]{25})$|(?<editPath>.+)\/(?<editId>[a-z0-9]{25})\/(edit)$/,
);

/**
 * If a record id is found in the URL, it is moved to permission property `resourceId`.
 */
export function normalizeRoutePermission(
  permission: Pick<Permission, "resource" | "action" | "scope">,
): Pick<Permission, "resource" | "scope" | "action" | "resourceId"> {
  const routePermissionWithId = groupRoutePermissionWithIdRegex.exec(
    permission.resource,
  );

  if (routePermissionWithId) {
    if (routePermissionWithId.groups?.editId) {
      return {
        ...permission,
        resource: `${routePermissionWithId.groups.editPath}/edit`,
        resourceId: routePermissionWithId.groups.editId,
      };
    }

    if (routePermissionWithId.groups?.viewId) {
      return {
        ...permission,
        resource: `${routePermissionWithId.groups.viewPath}/view`,
        resourceId: routePermissionWithId.groups.viewId,
      };
    }

    throw new Error(
      "Reached unsupported regex capturing group for route permission with id" +
        JSON.stringify(permission, null, 2),
    );
  }

  return { ...permission, resourceId: undefined };
}
