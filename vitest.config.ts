/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { ViteUserConfig, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()] as ViteUserConfig["plugins"],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup-test-env.ts"],
  },
});
