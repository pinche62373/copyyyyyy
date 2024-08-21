import { modelPermissions as accountPermissions } from "#app/permissions/definitions/account";
import { modelPermissions as adminPermissions } from "#app/permissions/definitions/admin";
import { modelPermissions as countryPermissions } from "#app/permissions/definitions/country";
import { modelPermissions as languagePermissions } from "#app/permissions/definitions/language";
import { modelPermissions as permissionPermissions } from "#app/permissions/definitions/permission";
import { modelPermissions as regionPermissions } from "#app/permissions/definitions/region";
import { modelPermissions as resourcePermissions } from "#app/permissions/definitions/resource";
import { modelPermissions as rolePermissions } from "#app/permissions/definitions/role";
import { modelPermissions as systemPermissions } from "#app/permissions/definitions/system";
import { Permission } from "#app/permissions/permission.types";
import {
  generateModelPermissions,
  isDuplicatePermission,
} from "#app/utils/permissions.server";

export const getModelPermissions = (): Permission[] => {
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
};
