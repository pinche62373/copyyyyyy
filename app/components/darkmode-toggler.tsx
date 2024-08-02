import { Theme, useTheme } from "remix-themes";

import { IconDarkModeDisable } from "#app/components/icons/icon-darkmode-disable";
import { IconDarkModeEnable } from "#app/components/icons/icon-darkmode-enable";

export function DarkModeToggler({ ...props }) {
  const [theme, setTheme] = useTheme();

  return (
    <button
      type="button"
      onClick={() =>
        setTheme((prev) => (prev === Theme.DARK ? Theme.LIGHT : Theme.DARK))
      }
      {...props}
    >
      {theme === Theme.LIGHT && <IconDarkModeEnable />}

      {theme === Theme.DARK && <IconDarkModeDisable />}
    </button>
  );
}
