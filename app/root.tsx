import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  LiveReload,
  MetaFunction,
  Outlet,
  useLoaderData,
  useLocation
} from "@remix-run/react";
import reactMenuStyleSheet from "@szhsin/react-menu/dist/index.css";
import reactMenuTransitionStylesheet from "@szhsin/react-menu/dist/transitions/zoom.css";
import { type IStaticMethods } from "preline/preline";
import { useEffect } from "react";
import { Slide, ToastContainer, toast as notify } from "react-toastify";
import toastStyles from "react-toastify/dist/ReactToastify.css";
import { type Theme } from "remix-themes";
import type { ToastMessage } from "remix-toast";
import { getToast } from "remix-toast";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import { HoneypotInputProps } from "remix-utils/honeypot/server";

import { Document } from "#app/components/document";
import { ErrorBoundaryRoot } from "#app/components/error-boundary-root";
import sharedStyleSheet from "#app/styles/shared.css";
import { getUser } from "#app/utils/auth.server";
import { honeypot } from "#app/utils/honeypot.server";
import { themeSessionResolver } from "#app/utils/theme.server";

export const links: LinksFunction = () => [
  ...(cssBundleHref
    ? [
        { rel: "stylesheet", href: cssBundleHref },
        { rel: "stylesheet", href: reactMenuStyleSheet, as: "style" },
        { rel: "stylesheet", href: reactMenuTransitionStylesheet, as: "style" },
        { rel: "stylesheet", href: toastStyles },
        { rel: "stylesheet", href: sharedStyleSheet, as: "style" }
      ]
    : [])
];

// root layout of the entire app, all other routes render inside its <Outlet />
export { Document as Layout };

// ----------------------------------------------------------------------------
// metadata
// ----------------------------------------------------------------------------
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data ? "mdb - movie database" : "Error | mdb" },
    {
      name: "description",
      content: `MDB`
    }
  ];
};

// ----------------------------------------------------------------------------
// fetch user data and cookies for preferred-theme and toast messages
// ----------------------------------------------------------------------------
export interface LoaderData {
  user: ReturnType<typeof getUser> extends Promise<infer T> ? T : never;
  toast: ToastMessage | undefined;
  theme: Theme | null;
  honeypotInputProps: HoneypotInputProps;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { getTheme } = await themeSessionResolver(request);

  const { toast, headers } = await getToast(request);

  const data: LoaderData = {
    user: await getUser(request),
    theme: getTheme(),
    toast,
    honeypotInputProps: honeypot.getInputProps()
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("preline/preline");
}

// ----------------------------------------------------------------------------
// App
// ----------------------------------------------------------------------------
function App() {
  const location = useLocation();

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
    <>
      <Outlet />

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />

      {process.env.NODE_ENV === "development" && <LiveReload />}
    </>
  );
}

// ----------------------------------------------------------------------------
// App With Providers
// ----------------------------------------------------------------------------
export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();

  return (
    <HoneypotProvider {...data.honeypotInputProps}>
      <App />
    </HoneypotProvider>
  );
}

export function ErrorBoundary() {
  return <ErrorBoundaryRoot />;
}

export function HydrateFallback() {
  return <h1>Loading...</h1>;
}
