import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { type IStaticMethods } from "preline/preline";
import { useEffect } from "react";

import "@fontsource-variable/inter/wght.css";
import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ user: await getUser(request) });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data ? "tzdb.org - the zoo database" : "Error | tzdb.org" },
    {
      name: "description",
      content: `The Zoo Database is an on-line searchable archive referencing over xxx unique zoo movie titles and more than xxx performers.`,
    },
  ];
};

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods; // preline
  }
}
if (typeof window !== "undefined") {
  require("preline/preline");
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods.autoInit(); // preline
  }, [location.pathname]);

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
