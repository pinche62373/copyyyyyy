import { Outlet } from "@remix-run/react";

import { AdminHeader } from "#app/components/admin/admin-header";

export default function PublicLayout() {
  return (
    <>
      <AdminHeader className="bg-red-200"/>

      <Outlet />
    </>
  );
}
