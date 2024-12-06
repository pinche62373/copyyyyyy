import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { FrontendHeader } from "#app/components/frontend/header";

import frontendStyles from "#app/styles/frontend.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: frontendStyles, as: "style" },
];

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
