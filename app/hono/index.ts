/**
 * @fileoverview THIS FILE IS MANAGED BY THE UPSTREAM REPO - DO NOT MODIFY.
 * Any changes to this file will be overwritten during the next sync.
 * To make changes, please modify the upstream code instead.
 */
import fs from "fs-extra";
import { createHonoServer } from "react-router-hono-server/node";

let config = {};

if (await fs.pathExists("./app/hono/config.ts")) {
  // @ts-ignore: config file might or might not exist
  const honoConfig = await import("./config.ts");
  config = honoConfig.default;
}

export default await createHonoServer({
  ...config,
});
