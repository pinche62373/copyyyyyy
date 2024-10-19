import tailwindForms from "@tailwindcss/forms"
import preline from "preline/plugin"
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "node_modules/preline/dist/*.js"],
  theme: {
    extend: {}
  },
  darkMode: ["selector", '[data-theme="dark"]'],
  plugins: [preline , tailwindForms]
} satisfies Config;
