export function getModelCrud() {
  const crudCountry = {
    target: "/admin/countries",
    singular: "Country",
    plural: "Countries",
  };

  const crudLanguage = {
    target: "/admin/languages",
    singular: "Language",
    plural: "Languages",
  };

  const crudPermission = {
    target: "/admin/rbac/permissions",
    singular: "Permission",
    plural: "Permissions",
  };

  const crudRegion = {
    target: "/admin/regions",
    singular: "Region",
    plural: "Regions",
  };

  return {
    crudCountry,
    crudLanguage,
    crudPermission,
    crudRegion,
  };
}
