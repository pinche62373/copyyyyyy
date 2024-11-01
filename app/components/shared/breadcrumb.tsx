import { Link } from "@remix-run/react";
import { tv } from "tailwind-variants";

import { IconForwardSlash } from "#app/components/icons/icon-forward-slash";

/**
 * Type for use inside route handle()
 */
export interface BreadcrumbHandleProps {
  name: string;
  to?: string;
}

export type BreadcrumbHandle = BreadcrumbHandleProps[];

/**
 * Interface for crumb elements.
 */
interface BreadcrumbProps {
  name: string;
  position: number;
  to?: string;
  last?: boolean;
}

export const Breadcrumb = ({ name, to, position, last }: BreadcrumbProps) => {
  const tvBreadcrumb = tv({
    base: "text-sm text-gray-500 hover:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500",
    variants: {
      state: {
        noLink: "pointer-events-none flex text-gray-700 dark:text-neutral-400",
        last: "pointer-events-none text-gray-700 dark:text-neutral-400"
      }
    }
  });

  return (
    <li
      className="contents"
      itemProp="itemListElement"
      itemScope
      itemType="https://schema.org/ListItem"
    >
      {/* Crumb without link */}
      {!to && !last && (
        <div className={tvBreadcrumb({ state: "noLink" })}>
          {name}{" "}
          <IconForwardSlash
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="size-5 shrink-0 text-gray-400 dark:text-neutral-600"
          />
        </div>
      )}

      {/* Last crumb */}
      {last && <span className={tvBreadcrumb({ state: "last" })}>{name}</span>}

      {/* Normal crumb */}
      {!last && to && (
        <>
          <Link to={to} className={tvBreadcrumb()}>
            {name}
          </Link>
          <IconForwardSlash
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="size-5 shrink-0 text-gray-400 dark:text-neutral-600"
          />
        </>
      )}

      {/* Always add position */}
      <meta itemProp="position" content={position as unknown as string} />
    </li>
  );
};
