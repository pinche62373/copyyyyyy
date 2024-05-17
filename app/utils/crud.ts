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

  const crudRegion = {
    target: "/admin/regions",
    singular: "Region",
    plural: "Regions",
  };

  return {
    crudCountry,
    crudLanguage,
    crudRegion,
  };
}
