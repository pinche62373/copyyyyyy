import type React from "react";
import { NavLink } from "react-router";
import { cn } from "#app/utils/lib/cn";
import { useUser, userHasRoutePermission } from "#app/utils/user";

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

  let marginLeft = nested ? "ml-1.5" : "ml-5";

  className = cn(
    `mb-1.5 ${marginLeft}`,
    "flex gap-x-3 rounded-xs px-3 py-2 focus:outline-none",
    "text-sm text-sidebar-secondary",
    "hover:bg-sidebar-hover hover:text-sidebar-primary",
    "focus:bg-sidebar-hover focus:text-sidebar-primary",
  );

  if (nested === true) {
    return (
      <NavLink to={to} className={className} {...rest}>
        {children}
      </NavLink>
    );
  }

  return (
    <li>
      <NavLink to={to} className={className} {...rest}>
        {children}
      </NavLink>
    </li>
  );
}
