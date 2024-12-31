import type { LinksFunction, MetaFunction } from "react-router";
import { Outlet } from "react-router";
import { FrontendHeader } from "#app/components/frontend/header";

import frontendStyles from "#app/styles/frontend.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: frontendStyles, as: "style", preload: "false" },
];

export const meta: MetaFunction = () => [
  { title: "TZDB" },
  { name: "description", content: "TZDB Frontend" },
];

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
