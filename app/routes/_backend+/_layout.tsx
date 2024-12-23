import fontInter from "@fontsource-variable/inter/wght.css?url";
import modernDrawerStyles from "react-modern-drawer/dist/index.css?url";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";
import { Outlet } from "react-router";
import { BackendHeader } from "#app/components/backend/header";
import { BackendSidebar } from "#app/components/backend/sidebar/sidebar";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import backendStyles from "#app/styles/backend.css?url";
import { isAuthenticated } from "#app/utils/auth.server";
import { ROUTE_LOGIN } from "#app/utils/constants";
import { requireRole } from "#app/utils/permissions.server";
import { Roles } from "#app/validations/role-schema";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: fontInter, as: "font" },
  { rel: "stylesheet", href: modernDrawerStyles, as: "style" },
  { rel: "stylesheet", href: backendStyles, as: "style" },
];

export const meta: MetaFunction = () => [
  { title: "TZDB Admin" },
  { name: "description", content: "TZDB Admin Interface" },
];

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [{ name: "Dashboard", to: "/admin" }],
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  // RR7: replaced with function clone
  await isAuthenticated(request, ROUTE_LOGIN + `?returnTo=${url.pathname}`);

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
