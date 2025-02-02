import { reactRouter } from "@react-router/dev/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";

export default defineConfig({
  plugins: [
    reactRouterDevTools(),
    reactRouterHonoServer({
      serverEntryPoint: "./app/hono",
    }),
    reactRouter(),
    iconsSpritesheet({
      withTypes: true, // True to generate TS types
      inputDir: "./other/svg-icons", // Path to folder with svg icons
      outputDir: "./app/ui/upstream/icons", // Path to folder with generated spritesheet and types
      // typesOutputFile:  // Path to generated type file (defaults to types.ts in outputDir)
      fileName: "spritesheet.svg", // Name of generated spritesheet (defaults to sprite.svg)
      cwd: process.cwd(), // The cwd, defaults to process.cwd()
      // formatter: "biome", // Formatter to use
      // pathToFormatterConfig: "./biome.json", // Path to formatter config file
      // Callback function that is called when the script is generating the icon name
      // This is useful if you want to modify the icon name before it is written to the file
      iconNameTransformer: (iconName) => iconName.toLowerCase(),
    }),
    visualizer({ emitFile: true }),
  ],
  build: {
    assetsInlineLimit: 0, // or SVG sprites will not show (TODO: fix)
  },
});
