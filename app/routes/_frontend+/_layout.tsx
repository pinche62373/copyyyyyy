import { Outlet } from "@remix-run/react";

import { FrontendHeader } from "#app/components/frontend/header";

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
