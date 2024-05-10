import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "node_modules/preline/dist/*.js"],
  theme: {
    extend: {},
  },
  darkMode: 'selector',
  plugins: [
    require('preline/plugin'),
    require('@tailwindcss/forms'),
  ],
} satisfies Config;
