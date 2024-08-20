import React from "react";

import { cn } from "#app/utils/misc";
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
        className="hs-accordion-toggle hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:bg-neutral-700 focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700"
      >
        {icon && icon}
        {caption}
        <svg
          className="hs-accordion-active:-rotate-180 flex-shrink-0 mt-1 size-3.5 ms-auto transition"
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
        className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden "
      >
        <ul
          className="hs-accordion-group ps-7 mt-1.5 space-y-1.5 relative before:absolute before:top-0 before:start-[18px] before:w-0.5 before:h-full before:bg-gray-100 dark:before:bg-neutral-700"
          data-hs-accordion-always-open
        >
          {children}
        </ul>
      </div>
    </li>
  );
}
