type CrudList = Record<
  string,
  {
    index: string;
    singular: string;
    plural: string;
  }
>;
[];

export function getCrud(): CrudList {
  const crudCountry = {
    index: "/admin/countries",
    singular: "Country",
    plural: "Countries",
  };

  const crudEntity = {
    index: "/admin/rbac/entities",
    singular: "Entity",
    plural: "Entities",
  };

  const crudLanguage = {
    index: "/admin/languages",
    singular: "Language",
    plural: "Languages",
  };

  const crudPermission = {
    index: "/admin/rbac/permissions",
    singular: "Permission",
    plural: "Permissions",
  };

  const crudRegion = {
    index: "/admin/regions",
    singular: "Region",
    plural: "Regions",
  };

  const crudRole = {
    index: "/admin/rbac/roles",
    singular: "Role",
    plural: "Roles",
  };

  return {
    crudCountry,
    crudEntity,
    crudLanguage,
    crudPermission,
    crudRegion,
    crudRole,
  };
}
