import reactMenuStyles from "@szhsin/react-menu/dist/index.css?url";
import reactMenuTransitions from "@szhsin/react-menu/dist/transitions/zoom.css?url";
import { useEffect } from "react";
import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { MetaFunction, Outlet, useLoaderData } from "react-router";
import { Slide, ToastContainer, toast as notify } from "react-toastify";
import reactToastify from "react-toastify/dist/ReactToastify.css?url";
import type { ToastMessage } from "remix-toast";
import { getToast } from "remix-toast";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import { HoneypotInputProps } from "remix-utils/honeypot/server";
import { Document } from "#app/components/document";
import { ErrorBoundaryRoot } from "#app/components/error-boundary-root";
import sharedStyles from "#app/styles/shared.css?url";
import { href as iconsHref } from "#app/ui/icon.tsx";
import { getUser } from "#app/utils/auth.server";
import { honeypot } from "#app/utils/honeypot.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: iconsHref, as: "image" }, // svg sprite sheet
  { rel: "stylesheet", href: reactMenuStyles, as: "style" },
  { rel: "stylesheet", href: reactMenuTransitions, as: "style" },
  { rel: "stylesheet", href: reactToastify, as: "style" },
  { rel: "stylesheet", href: sharedStyles, as: "style" },
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
// fetch user data and cookies for toast messages
// ----------------------------------------------------------------------------
export interface LoaderData {
  user: ReturnType<typeof getUser> extends Promise<infer T> ? T : never;
  toast: ToastMessage | undefined;
  honeypotInputProps: HoneypotInputProps;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);

  return data(
    {
      user: await getUser(request),
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
