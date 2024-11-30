import tailwindForms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";

import { tailwindVariables } from "#app/styles/tailwind.variables";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      ...tailwindVariables,
    },
  },
  darkMode: ["selector", '[data-theme="dark"]'],
  plugins: [tailwindForms],
} satisfies Config;
