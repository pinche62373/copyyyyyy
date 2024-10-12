import { Theme, useTheme } from "remix-themes";
import { useHydrated } from "remix-utils/use-hydrated";

import { IconDarkModeDisable } from "#app/components/icons/icon-darkmode-disable";
import { IconDarkModeEnable } from "#app/components/icons/icon-darkmode-enable";

export function DarkModeToggler({ ...props }) {
  const isHydrated = useHydrated();

  const [theme, setTheme] = useTheme();

  return (
    <>
      {isHydrated ? (
        <button
          aria-label="Toggle Theme"
          type="button"
          className="inline-flex size-[38px] items-center justify-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          onClick={() =>
            setTheme((prev) => (prev === Theme.DARK ? Theme.LIGHT : Theme.DARK))
          }
          {...props}
        >
          {theme === Theme.LIGHT && <IconDarkModeEnable />}

          {theme === Theme.DARK && <IconDarkModeDisable />}
        </button>
      ) : null}
    </>
  );
}
