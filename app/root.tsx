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
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import clsx from "clsx";
import { type IStaticMethods } from "preline/preline";
import { useEffect } from "react";
import type { ToastMessage } from "remix-toast";
import { getToast } from "remix-toast";
import { Toaster, toast as notify } from "sonner";

import stylesheet from "#app/tailwind.css";
import { getUser } from "#app/utils/auth.server";
import {
  Theme,
  ThemeBody,
  ThemeHead,
  ThemeProvider,
  useTheme,
} from "#app/utils/theme-provider";
import { getThemeSession } from "#app/utils/theme.server";

import { setToastCookieOptions } from "./utils/toaster.server";

import "@fontsource-variable/inter/wght.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

// ----------------------------------------------------------------------------
// metadata
// ----------------------------------------------------------------------------
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data ? "tzdb.org - the zoo database" : "Error | tzdb.org" },
    {
      name: "description",
      content: `The Zoo Database is an on-line searchable archive referencing over xxx unique zoo movie titles and more than xxx performers.`,
    },
  ];
};

// ----------------------------------------------------------------------------
// fetch user data and cookies for preferred-theme and toast messages
// ----------------------------------------------------------------------------
export interface LoaderData {
  user: ReturnType<typeof getUser> extends Promise<infer T> ? T : never;
  theme: Theme | null;
  toast: ToastMessage | undefined;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const themeSession = await getThemeSession(request);

  setToastCookieOptions();

  const { toast, headers } = await getToast(request);

  const data: LoaderData = {
    user: await getUser(request),
    theme: themeSession.getTheme(),
    toast,
  };

  return json({ ...data }, { headers });
};

// ----------------------------------------------------------------------------
// preline
// ----------------------------------------------------------------------------
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}
if (typeof window !== "undefined") {
  require("preline/preline");
}

// ----------------------------------------------------------------------------
// App
// ----------------------------------------------------------------------------
function App() {
  const location = useLocation();
  const data = useLoaderData<LoaderData>();
  const [theme] = useTheme();
  const { toast } = useLoaderData<LoaderData>();

  useEffect(() => {
    window.HSStaticMethods.autoInit(); // preline
  }, [location.pathname]);

  useEffect(() => {
    if (toast?.type) {
      notify[toast?.type](toast.message);
    }
  }, [toast]);

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(data.theme)} />
      </head>
      <body className="h-full bg-gray-50 dark:bg-neutral-900">
        <Outlet />
        <ThemeBody ssrTheme={Boolean(data.theme)} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Toaster
          position="top-right"
          richColors
          expand
          toastOptions={{ classNames: { title: "font-normal" } }}
        />
      </body>
    </html>
  );
}

// ----------------------------------------------------------------------------
// Themed App
// ----------------------------------------------------------------------------
export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}
