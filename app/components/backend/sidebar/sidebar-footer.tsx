import * as Constants from "#app/utils/constants";
import { cn } from "#app/utils/misc";

interface Args {
  className?: string;
}

export function SidebarFooter({ className, ...rest }: Args) {
  return (
    <footer
      className={cn(
        "hidden lg:block absolute bottom-0 inset-x-0 border-t border-gray-200 dark:border-neutral-700",
        className,
      )}
      {...rest}
    >
      <p className="w-full text-sm inline-flex items-center py-3 px-7 text-start text-gray-800 align-middle disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-white dark:focus:bg-neutral-700">
        Version {Constants.VERSION}
      </p>
    </footer>
  );
}
