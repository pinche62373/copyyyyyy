import { remixConfigRoutes } from "@react-router/remix-config-routes-adapter";
import { flatRoutes } from "remix-flat-routes";

const routes = remixConfigRoutes((defineRoutes) => {
  return flatRoutes("routes", defineRoutes, {
    /* options */
  });
});

export default routes;
