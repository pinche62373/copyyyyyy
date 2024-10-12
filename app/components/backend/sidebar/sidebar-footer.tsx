import * as Constants from "#app/utils/constants";
import { cn } from "#app/utils/lib/cn";

interface Args {
  className?: string;
}

export function SidebarFooter({ className, ...rest }: Args) {
  return (
    <footer
      className={cn(
        "hidden lg:block absolute bottom-0 inset-x-0 border-t border-gray-200 dark:border-neutral-700",
        className
      )}
      {...rest}
    >
      <p className="inline-flex w-full items-center px-7 py-3 text-start align-middle text-sm text-gray-800 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
        Version {Constants.VERSION}
      </p>
    </footer>
  );
}
