import { getModelPermissions } from "#app/permissions/get-model-permissions";
import { getRoutePermissions } from "#app/permissions/get-route-permissions";
import { Permission } from "#app/permissions/permission.types";

export const getAllPermissions = (): Permission[] => {
  return Array.prototype.concat(getModelPermissions(), getRoutePermissions());
};
