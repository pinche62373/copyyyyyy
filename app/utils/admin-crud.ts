export interface Crud {
  singular: string;
  plural: string;
  routes: CrudRoutes;
}

interface CrudRoutes {
  index: string;
  view: string;
  new: string;
  edit: string;
  delete: string;
}

type CrudList = Record<string, Crud>;

const getRoutes = (indexRoute: string): CrudRoutes => {
  return {
    index: indexRoute,
    view: `${indexRoute}/view`,
    new: `${indexRoute}/new`,
    edit: `${indexRoute}/edit`,
    delete: `${indexRoute}/delete`,
  };
};

export function getAdminCrud(): CrudList {
  const countryCrud = {
    singular: "country",
    plural: "countries",
    routes: getRoutes("/admin/countries"),
  };

  const resourceCrud = {
    singular: "resource",
    plural: "resources",
    routes: getRoutes("/admin/security/resources"),
  };

  const languageCrud = {
    singular: "language",
    plural: "languages",
    routes: getRoutes("/admin/languages"),
  };

  const permissionCrud = {
    singular: "permission",
    plural: "permissions",
    routes: getRoutes("/admin/security/permissions"),
  };

  const regionCrud = {
    singular: "region",
    plural: "regions",
    routes: getRoutes("/admin/regions"),
  };

  const roleCrud = {
    singular: "role",
    plural: "roles",
    routes: getRoutes("/admin/security/roles"),
  };

  return {
    countryCrud,
    resourceCrud,
    languageCrud,
    permissionCrud,
    regionCrud,
    roleCrud,
  };
}
