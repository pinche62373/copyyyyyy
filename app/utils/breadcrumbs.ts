import { UIMatch } from "@remix-run/react";

export interface CustomBreadcrumbRoute {
  path: string;
  breadcrumb?: string | null;
  props?: {
    noLink?: boolean;
  };
}

/**
 * Returns enriched custom breadcrumb routes object:
 *
 * - Replacing record id with record name for dynamic pages
 */
export const enhanceCustomBreadcrumbRoutes = (
  routes: CustomBreadcrumbRoute[],
  routeMatches: UIMatch[],
): CustomBreadcrumbRoute[] => {
  const activeRouteMatch = routeMatches[routeMatches.length - 1];

  const regexDynamicPage = activeRouteMatch.id.match(/\/\$([a-z]+)Id/);

  if (!regexDynamicPage) {
    return routes; // not a dynamic page
  }

  const modelName = regexDynamicPage[1];

  // biome-ignore lint/suspicious/noExplicitAny: Known Breadcrumbs issue
  const activeRouteData = activeRouteMatch.data as any;

  // https://regex101.com/r/UhtWVi/1
  const regexDynamicPagePath = new RegExp(
    String.raw`(.+${activeRouteData[modelName].id}).*$`,
  );

  routes.push({
    path: activeRouteMatch.pathname.replace(regexDynamicPagePath, "$1"),
    breadcrumb: activeRouteData[modelName].name,
    props: {},
  });

  return routes;
};
