import { UIMatch } from "@remix-run/react";

/**
 * Create custom breadcrumb routes for dynamic pages.
 * 
 * TODO move Home rename out of this function
 */
export const dynamicBreadcrumbRoutes = (routeMatches: UIMatch[]) => {
  const result = [{ path: "/admin", breadcrumb: "Home" }];

  const activeRoute = routeMatches[routeMatches.length - 1];

  const regexMatches = activeRoute.id.match(/\/\$([a-z]+)Id/);

  if (!regexMatches) {
    return result; // not a dynamic page
  }

  const modelName = regexMatches[1];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeRouteData = activeRoute.data as any;

  // https://regex101.com/r/UhtWVi/1
  const regexDynamicPagePath = new RegExp(
    String.raw`(.+${activeRouteData[modelName].id}).*$`,
  );

  result.push({
    path: activeRoute.pathname.replace(regexDynamicPagePath, "$1"),
    breadcrumb: activeRouteData[modelName].name,
  });

  return result;
};
