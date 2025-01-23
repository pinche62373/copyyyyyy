import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import type React from "react";
import { Icon } from "#app/components/ui/icon.tsx";
import { cn } from "#app/utils/lib/cn";
import { useUser, userHasRole } from "#app/utils/user";
import type { Role } from "#app/validations/role-schema";

interface Args {
  caption: string;
  id: string;
  icon?: React.JSX.Element;
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
    <li>
      <Accordion {...rest}>
        <AccordionItem
          headingTag="h2"
          header={({ state: { isEnter } }) => (
            <>
              {icon} {caption}
              <Icon
                name="chevron-down"
                className={`mt-0.5 size-4 ms-auto transition duration-200 dark:stroke-2 ${isEnter && "rotate-180"}`}
              />
            </>
          )}
          className={cn(" relative mt-1.5 space-y-1.5 ml-5")}
          buttonProps={{
            className: cn(
              "flex w-full gap-x-3 rounded-xs px-3 py-2 mr-2",
              "focus:outline-none disabled:pointer-events-none disabled:opacity-50",
              "text-start text-sm text-sidebar-secondary",
              "hover:bg-sidebar-hover hover:text-sidebar-primary",
            ),
          }}
        >
          <div
            className={cn(
              "ml-5",
              "border-2 border-t-0 border-r-0 border-b-0",
              "border-l-gray-200/80",
              "dark:border-l-slate-700/40",
            )}
          >
            {children}
          </div>
        </AccordionItem>
      </Accordion>
    </li>
  );
}
