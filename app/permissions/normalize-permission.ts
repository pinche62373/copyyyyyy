import { Permission } from "#app/permissions/permission.types";

/**
 * This regex extracts below named capturing groups for VIEW and EDIT route permissions:
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
 * Adds `recordId` property to permission objects.
 */
export function normalizePermission(
  permission: Pick<Permission, "resource" | "action" | "scope">,
): Pick<Permission, "resource" | "scope" | "action" | "recordId"> {
  const routePermissionWithId = groupRoutePermissionWithIdRegex.exec(
    permission.resource,
  );

  if (routePermissionWithId) {
    if (routePermissionWithId.groups?.editId) {
      return {
        ...permission,
        resource: `${routePermissionWithId.groups.editPath}/edit`,
        recordId: routePermissionWithId.groups.editId,
      };
    }

    if (routePermissionWithId.groups?.viewId) {
      console.log
      return {
        ...permission,
        resource: `${routePermissionWithId.groups.viewPath}/view`,
        recordId: routePermissionWithId.groups.viewId,
      };
    }

    throw new Error(
      "Reached unsupported regex capturing group for route permission with id" +
        JSON.stringify(permission, null, 2),
    );
  }

  // TODO handle model permissions
  return { ...permission, recordId: null };
}
