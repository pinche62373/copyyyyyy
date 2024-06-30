export interface Crud {
  singular: string;
  plural: string;
  routes: Routes;
}

interface Routes {
  index: string;
  view: string;
  new: string;
  edit: string;
  delete: string;
}

type CrudList = Record<string, Crud>;
[];

const getRoutes = (indexRoute: string): Routes => {
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
    singular: "Country",
    plural: "Countries",
    routes: getRoutes("/admin/countries"),
  };

  const entityCrud = {
    singular: "Entity",
    plural: "Entities",
    routes: getRoutes("/admin/rbac/entities"),
  };

  const languageCrud = {
    singular: "Language",
    plural: "Languages",
    routes: getRoutes("/admin/languages"),
  };

  const permissionCrud = {
    singular: "Permission",
    plural: "Permissions",
    routes: getRoutes("/admin/rbac/permissions"),
  };

  const regionCrud = {
    singular: "Region",
    plural: "Regions",
    routes: getRoutes("/admin/regions"),
  };

  const roleCrud = {
    singular: "Role",
    plural: "Roles",
    routes: getRoutes("/admin/rbac/roles"),
  };

  return {
    countryCrud,
    entityCrud,
    languageCrud,
    permissionCrud,
    regionCrud,
    roleCrud,
  };
}
