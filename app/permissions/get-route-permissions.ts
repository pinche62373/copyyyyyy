import { routePermissions as adminPermissions } from "#app/permissions/admin.permissions";
import { routePermissions as countryPermissions } from "#app/permissions/country.permissions";
import { routePermissions as entityPermissions } from "#app/permissions/entity.permissions";
import { routePermissions as languagePermissions } from "#app/permissions/language.permissions";
import { routePermissions as permissionPermissions } from "#app/permissions/permission.permissions";
import { routePermissions as regionPermissions } from "#app/permissions/region.permissions";
import { routePermissions as rolePermissions } from "#app/permissions/role.permissions";
import { routePermissions as systemPermissions } from "#app/permissions/system.permissions";
import {
  generateRoutePermissions,
  isDuplicatePermission,
} from "#app/utils/permissions.server";
import { Permission } from "#app/utils/permissions.types";

export const getRoutePermissions = (): Permission[] => {
  const result: Permission[] = [];

  Array.prototype
    .concat(
      adminPermissions,
      countryPermissions,
      entityPermissions,
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
