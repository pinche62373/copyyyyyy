import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { AdminHeader } from "#app/components/admin/admin-header";
import { AdminSidebar } from "#app/components/admin/admin-sidebar";
import adminStyleSheet from "#app/styles/admin.css";
import { requireUserId } from "#app/utils/auth.server";

// import styles for the admin route
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: adminStyleSheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

// require authentication
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  return null;
};

export default function AdminLayout() {
  return (
    <>
      <AdminHeader />

      <AdminSidebar />

      <main id="content" className="lg:ps-[260px] pt-[59px] lg:pt-0">
        <div className="relative px-5 py-4 lg:mt-16">
          <Outlet />
        </div>
      </main>
    </>
  );
}
