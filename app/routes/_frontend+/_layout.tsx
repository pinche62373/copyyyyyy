import { Outlet } from "@remix-run/react";

import { BackendHeader } from "#app/components/backend/header";

export default function PublicLayout() {
  return (
    <>
      <BackendHeader className="bg-red-200"/>

      <Outlet />
    </>
  );
}
