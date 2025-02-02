import fs from "fs-extra";
import { createHonoServer } from "react-router-hono-server/node";

let config = {};

// Synchronous check
if (fs.pathExistsSync("./app/hono/config.ts")) {
  try {
    // @ts-ignore: config file might or might not exist
    const honoConfig = require("./app/hono/config.ts");
    config = honoConfig.default;
  } catch (error) {
    console.warn("Failed to load hono config:", error);
  }
}

export default createHonoServer({
  ...config,
});
