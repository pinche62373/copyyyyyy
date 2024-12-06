import { Link } from "@remix-run/react";
import { tv } from "tailwind-variants";
import { IconSlash } from "#app/components/shared/icon-slash.tsx";

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
    base: "text-sm font-normal text-secondary-foreground",
    variants: {
      state: {
        link: "text-accent-foreground hover:underline",
        noLink: "flex",
      },
    },
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
          <IconSlash
            width={16}
            height={16}
            viewBox="0 0 16 16"
            className="size-5 shrink-0 text-gray-400 dark:text-neutral-600"
          />
        </div>
      )}

      {/* Last crumb */}
      {last && <span className={tvBreadcrumb()}>{name}</span>}

      {/* Normal crumb with link */}
      {!last && to && (
        <>
          <Link to={to} className={tvBreadcrumb({ state: "link" })}>
            {name}
          </Link>
          <IconSlash
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
