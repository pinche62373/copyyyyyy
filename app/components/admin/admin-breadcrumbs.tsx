import { Link, useMatches } from "@remix-run/react";
import { Fragment, ReactElement } from "react";
import useBreadcrumbs, { BreadcrumbData } from "use-react-router-breadcrumbs";

import { dynamicBreadcrumbRoutes } from "#app/utils/breadcrumbs";

export const AdminBreadcrumbs = ({ ...props }) => {
  const routeMatches = useMatches();

  const breadcrumbs = useBreadcrumbs(dynamicBreadcrumbRoutes(routeMatches), {
    excludePaths: ["/"],
  });

  return (
    <nav className="ml-5 mt-1">
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex items-center whitespace-nowrap"
        {...props}
      >
        {breadcrumbs.map((crumb: BreadcrumbData<string>, i: number) => {
          const breadCrumbElement = crumb.breadcrumb as ReactElement;

          return (
            <Fragment key={i}>
              <li
                className="inline-flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {/* Render a chevron except for a single OR the last crumb */}
                {i > 0 && (
                  <svg
                    className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                )}
                {/* Render a link except for a single OR the last crumb */}
                {i + 1 < breadcrumbs.length ? (
                  <Link
                    itemProp="item"
                    to={crumb.key}
                    {...props}
                    className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
                  >
                    <span itemProp="name">
                      {breadCrumbElement.props.children}
                    </span>
                  </Link>
                ) : (
                  <span className="flex items-center text-sm text-gray-500 focus:outline-none focus:text-blue-600 dark:text-neutral-500">
                    {breadCrumbElement.props.children}
                  </span>
                )}
                {/* Meta prop with crumb position */}
                <meta itemProp="position" content={`${i + 1}`} />
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
