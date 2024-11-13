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
  const liClass = nested === false && "mb-1.5 pl-5 pr-2";

  return (
    <li className={cn(liClass, className)} {...rest}>
      <NavLink
        to={to}
        className={cn(
          "flex gap-x-3 rounded-lg px-3 py-2 focus:outline-none",
          "text-sm text-sidebar-secondary",
          "hover:bg-sidebar-hover hover:text-sidebar-primary",
          "focus:bg-sidebar-hover focus:text-sidebar-primary"
        )}
      >
        {children}
      </NavLink>
    </li>
  );
}
