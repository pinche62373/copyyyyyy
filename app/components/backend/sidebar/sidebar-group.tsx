import React from "react";

import { cn } from "#app/utils/lib/cn";
import { useUser, userHasRole } from "#app/utils/user";
import { Role } from "#app/validations/role-schema";

interface Args {
  caption: string;
  id: string;
  icon?: JSX.Element;
  children: React.ReactNode;
  className?: string;
  require?: Role | Role[];
}

export function SidebarGroup({
  caption,
  id,
  icon,
  children,
  className,
  require,
  ...rest
}: Args) {
  const user = useUser();

  if (require) {
    if (!userHasRole(user, require)) {
      return;
    }
  }

  return (
    <li
      id={`accordion-${id}`}
      className={cn("hs-accordion px-5 mb-1.5", className)}
      {...rest}
    >
      <button
        type="button"
        className="hs-accordion-toggle flex w-full gap-x-3 rounded-lg px-3 py-2 text-start text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 hs-accordion-active:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hs-accordion-active:bg-neutral-700"
      >
        {icon && icon}
        {caption}
        <svg
          className="ms-auto mt-1 size-3.5 shrink-0 transition hs-accordion-active:-rotate-180"
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
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        id={`accordion-${id}-sub`}
        className="hs-accordion-content hidden w-full overflow-hidden transition-[height] duration-300"
      >
        <ul
          className="hs-accordion-group relative mt-1.5 space-y-1.5 ps-7 before:absolute before:start-[18px] before:top-0 before:h-full before:w-0.5 before:bg-gray-100 dark:before:bg-neutral-700"
          data-hs-accordion-always-open
        >
          {children}
        </ul>
      </div>
    </li>
  );
}
