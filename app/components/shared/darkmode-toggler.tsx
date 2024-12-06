import { Theme, useTheme } from "remix-themes";
import { Icon } from "#app/ui/icon.tsx";
import { cn } from "#app/utils/lib/cn.ts";

export function DarkModeToggler({ ...props }) {
  const [theme, setTheme] = useTheme();

  return (
    <button
      aria-label="Toggle Theme"
      type="button"
      className={cn(
        "inline-flex size-[38px] items-center justify-center gap-x-2 rounded-full border border-transparent",
        "focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        "text-gray-500 hover:bg-gray-100 focus:bg-gray-100",
        "dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
      )}
      onClick={() =>
        setTheme((prev) => (prev === Theme.DARK ? Theme.LIGHT : Theme.DARK))
      }
      {...props}
    >
      {theme === Theme.LIGHT && <Icon name="moon" />}

      {theme === Theme.DARK && <Icon name="sun-medium" />}
    </button>
  );
}
