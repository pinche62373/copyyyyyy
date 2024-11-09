import * as Constants from "#app/utils/constants";
import { cn } from "#app/utils/lib/cn";

interface Args {
  className?: string;
}

export function SidebarFooter({ className, ...rest }: Args) {
  return (
    <footer
      className={cn(
        "absolute inset-x-0 bottom-0 hidden border-t border-border lg:block",
        className
      )}
      {...rest}
    >
      <p
        className={cn(
          "inline-flex w-full items-center px-7 py-3 text-start align-middle",
          "focus:outline-none disabled:pointer-events-none disabled:opacity-50",
          "text-sm text-sidebar-primary hover:bg-sidebar-hover"
        )}
      >
        Version {Constants.VERSION}
      </p>
    </footer>
  );
}
