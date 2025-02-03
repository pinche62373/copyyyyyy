import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Outlet } from "react-router";
import { FrontendHeader } from "#app/components/frontend/header";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { isAuthenticated } from "#app/utils/auth.server";
import { ROUTE_LOGIN } from "#app/utils/constants";

import "#app/styles/app.css";

export const meta: MetaFunction = () => [
  { title: "TZDB" },
  { name: "description", content: "TZDB App" },
];

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [{ name: "App", to: "/app" }],
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  await isAuthenticated(request, ROUTE_LOGIN + `?returnTo=${url.pathname}`);

  return null;
};

export default function PublicLayout() {
  return (
    <>
      <FrontendHeader />

      <main id="content">
        <Outlet />
      </main>
    </>
  );
}
