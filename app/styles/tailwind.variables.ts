// https://www.sitepoint.com/theming-tailwind-css-variables-clean-architecture/

import { type Config } from "tailwindcss";

export const tailwindVariables = {
  colors: {
    input: "var(--input)",
    ring: "var(--ring)",
    background: "var(--background)",
    foreground: "var(--foreground)",

    border: {
      DEFAULT: "var(--border)",
      foreground: "var(--border-foreground)",
    },

    primary: {
      DEFAULT: "var(--primary)",
      foreground: "var(--primary-foreground)",
    },

    secondary: {
      DEFAULT: "var(--secondary)",
      foreground: "var(--secondary-foreground)",
    },

    tertiary: {
      DEFAULT: "var(--tertiary)",
      foreground: "var(--tertiary-foreground)",
    },

    accent: {
      DEFAULT: "var(--accent)",
      foreground: "var(--accent-foreground)",
    },

    sidebar: {
      primary: "var(--sidebar-primary)",
      secondary: "var(--sidebar-secondary)",
      hover: "var(--sidebar-hover)",
      focus: "var(--sidebar-focus)",
    },
  },
} satisfies Config["theme"];
