import { routePermissions as accountPermissions } from "#app/permissions/definitions/account";
import { routePermissions as adminPermissions } from "#app/permissions/definitions/admin";
import { routePermissions as countryPermissions } from "#app/permissions/definitions/country";
import { routePermissions as languagePermissions } from "#app/permissions/definitions/language";
import { routePermissions as permissionPermissions } from "#app/permissions/definitions/permission";
import { routePermissions as regionPermissions } from "#app/permissions/definitions/region";
import { routePermissions as resourcePermissions } from "#app/permissions/definitions/resource";
import { routePermissions as rolePermissions } from "#app/permissions/definitions/role";
import { routePermissions as systemPermissions } from "#app/permissions/definitions/system";
import { Permission } from "#app/permissions/permission.types";
import {
  generateRoutePermissions,
  isDuplicatePermission,
} from "#app/utils/permissions.server";

export const getRoutePermissions = (): Permission[] => {
  const result: Permission[] = [];

  Array.prototype
    .concat(
      accountPermissions,
      adminPermissions,
      countryPermissions,
      resourcePermissions,
      languagePermissions,
      permissionPermissions,
      regionPermissions,
      rolePermissions,
      systemPermissions,
    )
    .forEach((permission) => {
      generateRoutePermissions(permission).forEach((generatedPermission) => {
        if (isDuplicatePermission(result, generatedPermission)) {
          throw new Error(
            `Remix permission store already contains route permission: ${JSON.stringify(generatedPermission, null, 2)}`,
          );
        }

        result.push(generatedPermission as unknown as Permission);
      });
    });

  return result;
};
