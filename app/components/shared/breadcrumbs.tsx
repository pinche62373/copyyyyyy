import { UIMatch, useMatches } from "@remix-run/react";
import { HTMLAttributes } from "react";

import {
  Breadcrumb,
  type BreadcrumbHandle,
} from "#app/components/shared/breadcrumb";

type BreadcrumbMatch = UIMatch<
  Record<string, unknown>,
  { breadcrumb: (data?: unknown) => BreadcrumbHandle }
>;

export const Breadcrumbs = ({ ...props }: HTMLAttributes<HTMLElement>) => {
  const matches = useMatches() as unknown as BreadcrumbMatch[];

  const crumbs = matches
    .filter((match) => match.handle && match.handle.breadcrumb)
    .flatMap((match) => {
      const breadcrumb = match.handle.breadcrumb(match);

      if (!breadcrumb) return null;

      if (Array.isArray(breadcrumb)) {
        return breadcrumb.map((crumb) => crumb);
      }

      return breadcrumb;
    });

  if (crumbs.length === 0) {
    return;
  }

  return (
    <nav aria-label="Breadcrumbs">
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex flex-wrap items-center"
        {...props}
      >
        {crumbs.map((crumb, index, arr) => {
          if (arr.length - 1 === index) {
            return (
              <Breadcrumb
                name={crumb?.name || ""}
                to={crumb?.to || ""}
                key={index}
                position={index + 1}
                last={true}
              />
            );
          } else {
            return (
              <Breadcrumb
                name={crumb?.name || ""}
                to={crumb?.to || ""}
                key={index}
                position={index + 1}
              />
            );
          }
        })}
      </ol>
    </nav>
  );
};
