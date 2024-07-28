import { NavLink } from "@remix-run/react";

import { cn } from "#app/utils/misc";
import { userHasRoutePermission, useUser } from "#app/utils/user";

interface Args {
  to: string;
  children: React.ReactNode;
  className?: string;
  nested?: boolean;
}

export function SidebarLink({
  to,
  children,
  className,
  nested = false,
  ...rest
}: Args) {
  const user = useUser();

  if (!userHasRoutePermission(user, { entity: to, scope: "any" })) {
    return;
  }
  const liClass = nested === false && "px-5 mb-1.5";

  return (
    <li className={cn(liClass, className)} {...rest}>
      <NavLink
        to={to}
        className="flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700"
      >
        {children}
      </NavLink>
    </li>
  );
}
