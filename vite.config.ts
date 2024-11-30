import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from "vite";

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
      serverModuleFormat: "cjs",
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      },
      future: {
        v3_throwAbortReason: true,
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_singleFetch: true,
      },
    }),
  ],
  ssr: {
    noExternal: ["remix-utils"],
  },
});
