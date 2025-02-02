import type { MetaFunction } from "react-router";
import { Outlet } from "react-router";
import { FrontendHeader } from "#app/components/frontend/header";

import "#app/styles/frontend.css";

export const meta: MetaFunction = () => [
  { title: "TZDB" },
  { name: "description", content: "TZDB Frontend" },
];

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
