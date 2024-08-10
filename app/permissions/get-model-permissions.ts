import { modelPermissions as adminPermissions } from "#app/permissions/admin.permissions";
import { modelPermissions as countryPermissions } from "#app/permissions/country.permissions";
import { modelPermissions as resourcePermissions } from "#app/permissions/resource.permissions";
import { modelPermissions as languagePermissions } from "#app/permissions/language.permissions";
import { modelPermissions as permissionPermissions } from "#app/permissions/permission.permissions";
import { modelPermissions as regionPermissions } from "#app/permissions/region.permissions";
import { modelPermissions as rolePermissions } from "#app/permissions/role.permissions";
import { modelPermissions as systemPermissions } from "#app/permissions/system.permissions";
import {
  generateModelPermissions,
  isDuplicatePermission,
} from "#app/utils/permissions.server";
import { Permission } from "#app/permissions/permission.types";

export const getModelPermissions = (): Permission[] => {
  const result: Permission[] = [];

  Array.prototype
    .concat(
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
      generateModelPermissions(permission).forEach((generatedPermission) => {
        if (isDuplicatePermission(result, generatedPermission)) {
          throw new Error(
            `Remix permission store already contains model permission: ${JSON.stringify(generatedPermission, null, 2)}`,
          );
        }

        result.push(generatedPermission as unknown as Permission);
      });
    });

  return result;

  // return Array.prototype.concat(
  //   adminPermissions,
  //   countryPermissions,
  //   resourcePermissions,
  //   languagePermissions,
  //   permissionPermissions,
  //   regionPermissions,
  //   rolePermissions,
  //   systemPermissions,
  // );
};
