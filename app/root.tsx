import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { MetaFunction, Outlet, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { Slide, ToastContainer, toast as notify } from "react-toastify";
import { type Theme } from "remix-themes";
import type { ToastMessage } from "remix-toast";
import { getToast } from "remix-toast";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import { HoneypotInputProps } from "remix-utils/honeypot/server";
import { Document } from "#app/components/document";
import { ErrorBoundaryRoot } from "#app/components/error-boundary-root";
import { getUser } from "#app/utils/auth.server";
import { honeypot } from "#app/utils/honeypot.server";
import { themeSessionResolver } from "#app/utils/theme.server";

// stylesheets and fonts
import "#app/styles/shared.css";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";
import "react-toastify/dist/ReactToastify.css";

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

  const { toast, headers } = await getToast(request);

  const data: LoaderData = {
    user: await getUser(request),
    theme: getTheme(),
    toast,
    honeypotInputProps: honeypot.getInputProps(),
  };

  return json({ ...data }, { headers });
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
