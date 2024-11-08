import tailwindForms from "@tailwindcss/forms"
import preline from "preline/plugin"
import type { Config } from "tailwindcss";

import { tailwindVariables } from "#app/styles/tailwind.variables";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "node_modules/preline/dist/*.js"],
  theme: {
    extend: {
      ...tailwindVariables
    }
  },
  darkMode: ["selector", '[data-theme="dark"]'],
  plugins: [preline , tailwindForms]
} satisfies Config;
