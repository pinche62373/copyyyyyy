export function getModelCrud() {
  const crudLanguage = {
    target: "/admin/languages",
    singular: "Language",
    plural: "Languages",
  };

  const crudRegion = {
    target: "/admin/regions",
    singular: "Region",
    plural: "Regions",
  };

  return {
    crudLanguage,
    crudRegion,
  };
}
