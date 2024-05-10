import { IconDarkModeDisable } from "#app/components/icons/icon-darkmode-disable";
import { IconDarkModeEnable } from "#app/components/icons/icon-darkmode-enable";
import { Theme, useTheme } from "#app/utils/theme-provider";

export function DarkModeToggler({...props}) {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  return (
    <button type="button" onClick={toggleTheme} {...props}>
      { theme === Theme.LIGHT && (
        <IconDarkModeEnable /> 
      )}

      { theme === Theme.DARK && (
        <IconDarkModeDisable />
      )}
      
      </button>
  );
}
