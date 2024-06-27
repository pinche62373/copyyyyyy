import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  LiveReload,
  MetaFunction,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { type IStaticMethods } from "preline/preline";
import { useEffect } from "react";
import type { ToastMessage } from "remix-toast";
import { getToast } from "remix-toast";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import { HoneypotInputProps } from "remix-utils/honeypot/server";
import { Toaster, toast as notify } from "sonner";

import { Document } from "#app/components/document";
import { GeneralErrorBoundary } from "#app/components/general-error-boundary";
import stylesheet from "#app/tailwind.css";
import { getUser } from "#app/utils/auth.server";
import { honeypot } from "#app/utils/honeypot.server";
import { Theme, ThemeProvider, useTheme } from "#app/utils/theme-provider";
import { getThemeSession } from "#app/utils/theme.server";

import "@fontsource-variable/inter/wght.css";
import { setToastCookieOptions } from "./utils/toaster.server";

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
  honeypotInputProps: HoneypotInputProps;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const themeSession = await getThemeSession(request);

  setToastCookieOptions();

  const { toast, headers } = await getToast(request);

  const data: LoaderData = {
    user: await getUser(request),
    theme: themeSession.getTheme(),
    toast,
    honeypotInputProps: honeypot.getInputProps(),
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
  // const data = useLoaderData<LoaderData>();
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
    <Document theme={theme}>
      <Outlet />
      <LiveReload />
      <Toaster
        position="top-right"
        richColors
        expand
        toastOptions={{ classNames: { title: "font-normal" } }}
      />
    </Document>
  );
}

// ----------------------------------------------------------------------------
// Themed App
// ----------------------------------------------------------------------------
export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <HoneypotProvider {...data.honeypotInputProps}>
        <App />
      </HoneypotProvider>
    </ThemeProvider>
  );
}

// ----------------------------------------------------------------------------
// Top-Most Error Boundary
// ----------------------------------------------------------------------------
export function ErrorBoundary(data: LoaderData) {
  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <Document>
        <GeneralErrorBoundary />
      </Document>
    </ThemeProvider>
  );
}
