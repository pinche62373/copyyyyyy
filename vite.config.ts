import { vitePlugin as remix } from "@remix-run/dev";
import { remixDevTools } from "remix-development-tools";
import { flatRoutes } from "remix-flat-routes";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";

export default defineConfig({
  plugins: [
    remixDevTools(),
    remix({
      basename: "/",
      serverModuleFormat: "esm",
      serverBuildFile: "index.js",
      ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{ts,tsx}"],
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
    iconsSpritesheet({
      withTypes: true, // True to generate TS types
      inputDir: "./other/svg-icons", // Path to folder with svg icons
      outputDir: "./app/ui/icons", // Path to folder with generated spritesheet and types
      typesOutputFile: "./app/ui/icons/name.d.ts", // Path to generated type file (defaults to types.ts in outputDir)
      fileName: "sprite.svg", // Name of generated spritesheet (defaults to sprite.svg)
      cwd: process.cwd(), // The cwd, defaults to process.cwd()
      // formatter: "biome", // Formatter to use
      // pathToFormatterConfig: "./biome.json", // Path to formatter config file
      // Callback function that is called when the script is generating the icon name
      // This is useful if you want to modify the icon name before it is written to the file
      iconNameTransformer: (iconName) => iconName,
    }),
    visualizer({ emitFile: true }),
  ],
  build: {
    assetsInlineLimit: 0, // or SVG sprites will not show (TODO: fix)
  },
  ssr: {
    noExternal: ["remix-utils"],
  },
});
