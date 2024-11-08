// https://www.sitepoint.com/theming-tailwind-css-variables-clean-architecture/

import { type Config } from "tailwindcss";

export const tailwindVariables = {
  colors: {
    background: {
      DEFAULT: "var(--background)",
      border: "var(--background-border)",
      input: "var(--background-input)"
    },
    foreground: {
      DEFAULT: "var(--foreground)",
      border: "var(--foreground-border)",
      input: "var(--foreground-input)"
    },
    sidebar: {
      primary: "var(--sidebar-primary)",
      secondary: "var(--sidebar-secondary)",
      border: "var(--sidebar-border)",
      hover: "var(--sidebar-hover)",
      focus: "var(--sidebar-focus)"
    }
  },
  textColor: {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
  }
} satisfies Config["theme"];
