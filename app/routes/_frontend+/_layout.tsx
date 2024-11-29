import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { FrontendHeader } from "#app/components/frontend/header";

// stylesheet and fonts
import "#app/styles/frontend.css";

export const meta: MetaFunction = () => [{ title: "TZDB" }];

export default function FrontendLayout() {
  return (
    <>
      <FrontendHeader />

      <main id="content">
        <Outlet />
      </main>
    </>
  );
}
