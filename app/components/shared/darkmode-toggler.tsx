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
          className="size-[38px] inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
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
