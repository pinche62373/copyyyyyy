import { NavLink } from "@remix-run/react";

import { cn } from "#app/utils/lib/cn";
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

  if (!userHasRoutePermission(user, { resource: to, scope: "any" })) {
    return;
  }
  const liClass = nested === false && "px-5 mb-1.5";

  return (
    <li className={cn(liClass, className)} {...rest}>
      <NavLink
        to={to}
        className="flex gap-x-3 rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
      >
        {children}
      </NavLink>
    </li>
  );
}
