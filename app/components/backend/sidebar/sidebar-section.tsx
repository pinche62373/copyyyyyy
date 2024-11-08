import { cn } from "#app/utils/lib/cn";
import { useUser, userHasRole } from "#app/utils/user";
import { Role } from "#app/validations/role-schema";

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
      className={cn(
        "hs-accordion-group flex w-full flex-col flex-wrap",
        className
      )}
      data-hs-accordion-always-open
      {...rest}
    >
      <ul>
        {caption && (
          <li className="mb-1.5 mt-2 px-8 pb-1">
            <span className="block text-sm font-bold uppercase text-sidebar-primary">
              {caption}
            </span>
          </li>
        )}

        {children}
      </ul>
    </nav>
  );
}
