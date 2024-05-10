import { Theme, useTheme } from '#app/utils/theme-provider';

export function ThemeToggler() {
  const [, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  return (
    <button onClick={toggleTheme}>Toggle</button>
  );
}
