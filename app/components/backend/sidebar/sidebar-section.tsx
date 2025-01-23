import type React from "react";
import { cn } from "#app/utils/lib/cn";
import { useUser, userHasRole } from "#app/utils/user";
import type { Role } from "#app/validations/role-schema";

interface Args {
  children: React.ReactNode;
  className?: string;
  caption?: string;
  requireRole?: Role | Role[];
}

export function SidebarSection({
  children,
  className,
  caption,
  requireRole,
  ...rest
}: Args) {
  const user = useUser();

  if (requireRole) {
    if (!userHasRole(user, requireRole)) {
      return;
    }
  }

  return (
    <nav
      className={cn("flex w-full flex-col flex-wrap pr-2", className)}
      {...rest}
    >
      <ul>
        {caption && (
          <li className="mb-1.5 mt-2 px-8 pb-1">
            <span className="block text-sm font-medium uppercase text-sidebar-primary">
              {caption}
            </span>
          </li>
        )}

        {children}
      </ul>
    </nav>
  );
}
