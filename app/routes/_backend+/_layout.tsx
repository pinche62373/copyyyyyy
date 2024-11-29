import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { BackendHeader } from "#app/components/backend/header";
import { BackendSidebar } from "#app/components/backend/sidebar/sidebar";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { authenticator } from "#app/utils/auth.server";
import { AUTH_LOGIN_ROUTE } from "#app/utils/constants";
import { requireRole } from "#app/utils/permissions.server";
import { Roles } from "#app/validations/role-schema";

// stylesheets and fonts
import "#app/styles/backend.css";
import "@fontsource-variable/inter/wght.css?url";

export const meta: MetaFunction = () => [{ title: "TZDB Admin" }];

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [{ name: "Dashboard", to: "/admin" }],
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  await authenticator.isAuthenticated(request, {
    failureRedirect: AUTH_LOGIN_ROUTE + `?returnTo=${url.pathname}`,
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
