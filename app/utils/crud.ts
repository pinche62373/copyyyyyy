export function getCrud() {
  const crudCountry = {
    index: "/admin/countries",
    singular: "Country",
    plural: "Countries",
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

  return {
    crudCountry,
    crudLanguage,
    crudPermission,
    crudRegion,
  };
}
