import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/node";
import { MetaFunction, Outlet, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { Slide, ToastContainer, toast as notify } from "react-toastify";
import { Theme } from "remix-themes";
import type { ToastMessage } from "remix-toast";
import { getToast } from "remix-toast";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import { HoneypotInputProps } from "remix-utils/honeypot/server";
import { Document } from "#app/components/document";
import { ErrorBoundaryRoot } from "#app/components/error-boundary-root";
import { getUser } from "#app/utils/auth.server";
import { honeypot } from "#app/utils/honeypot.server";
import { themeSessionResolver } from "#app/utils/theme.server";

import reactMenuStyles from "@szhsin/react-menu/dist/index.css?url";
import reactMenuTransitions from "@szhsin/react-menu/dist/transitions/zoom.css?url";
import reactToastify from "react-toastify/dist/ReactToastify.css?url";
import sharedStyles from "#app/styles/shared.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: reactMenuStyles },
  { rel: "stylesheet", href: reactMenuTransitions },
  { rel: "stylesheet", href: reactToastify },
  { rel: "stylesheet", href: sharedStyles },
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
      content: `MDB`,
    },
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

  // prevent hydration errors when user has not yet created the theme cookie
  let theme = getTheme();

  if (theme === null) {
    theme = Theme.LIGHT;
  }

  const { toast, headers } = await getToast(request);

  return data(
    {
      user: await getUser(request),
      theme,
      toast,
      honeypotInputProps: honeypot.getInputProps(),
    },
    { headers },
  );
};

// ----------------------------------------------------------------------------
// App
// ----------------------------------------------------------------------------
function App() {
  const { toast } = useLoaderData<LoaderData>();

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
