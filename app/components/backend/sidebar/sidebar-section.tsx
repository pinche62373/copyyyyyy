import { cn } from "#app/utils/misc";
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
        "hs-accordion-group w-full flex flex-col flex-wrap",
        className,
      )}
      data-hs-accordion-always-open
      {...rest}
    >
      <ul>
        {caption && (
          <li className="pt-5 pb-2 px-8 mt-2 mb-1.5 border-t border-gray-200 dark:border-neutral-700">
            <span className="block text-xs uppercase text-gray-500 dark:text-neutral-500">
              {caption}
            </span>
          </li>
        )}

        {children}
      </ul>
    </nav>
  );
}
