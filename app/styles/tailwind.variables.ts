// https://www.sitepoint.com/theming-tailwind-css-variables-clean-architecture/

import { type Config } from "tailwindcss";

export const tailwindVariables = {
  colors: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    sidebar: {
      primary: "var(--sidebar-primary)",
      secondary: "var(--sidebar-secondary)",
      border: "var(--sidebar-border)",
      hover: "var(--sidebar-hover)",
      focus: "var(--sidebar-focus)"
    }
  }
} satisfies Config["theme"];
