import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { FrontendHeader } from "#app/components/frontend/header";
import frontendStyleSheet from "#app/styles/frontend.css";

// import styles for the frontend route
export const links: LinksFunction = () => [
  ...(cssBundleHref
    ? [{ rel: "stylesheet", href: frontendStyleSheet, as: "style" }]
    : []),
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
