import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction
} from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { BackendHeader } from "#app/components/backend/header";
import { BackendSidebar } from "#app/components/backend/sidebar/sidebar";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import backendStyleSheet from "#app/styles/backend.css";
import { authenticator } from "#app/utils/auth.server";
import { AUTH_LOGIN_ROUTE } from "#app/utils/constants";
import { requireRole } from "#app/utils/permissions.server";
import { Roles } from "#app/validations/role-schema";

// import fonts for the backend route
import "@fontsource-variable/inter/wght.css";

// import styles for the backend route
export const links: LinksFunction = () => [
  ...(cssBundleHref
    ? [{ rel: "stylesheet", href: backendStyleSheet, as: "style" }]
    : [])
];

export const meta: MetaFunction = () => [{ title: "TMDB Admin" }];

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [{ name: "Dashboard", to: "/admin" }]
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  await authenticator.isAuthenticated(request, {
    failureRedirect: AUTH_LOGIN_ROUTE + `?returnTo=${url.pathname}`
  });

  await requireRole(request, [Roles.ADMIN, Roles.MODERATOR]);

  return null;
};

export default function BackendLayout() {
  return (
    <>
      <BackendHeader />

      <BackendSidebar />

      <main id="content" className="pt-[59px] lg:ps-[260px] lg:pt-0">
        <div className="relative px-6 py-5 lg:mt-16">
          <Outlet />
        </div>
      </main>
    </>
  );
}
