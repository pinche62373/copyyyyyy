import reactMenuStyles from "@szhsin/react-menu/dist/index.css?url";
import reactMenuTransitions from "@szhsin/react-menu/dist/transitions/zoom.css?url";
import { useEffect } from "react";
import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import { type MetaFunction, Outlet, data, useLoaderData } from "react-router";
import { Slide, ToastContainer, toast as notify } from "react-toastify";
import type { ToastMessage } from "remix-toast";
import { getToast } from "remix-toast";
import { HoneypotProvider } from "remix-utils/honeypot/react";
import type { HoneypotInputProps } from "remix-utils/honeypot/server";
import { Document } from "#app/components/document";
import { ErrorBoundaryRoot } from "#app/components/error-boundary-root";
import { useTheme } from "#app/routes/resources+/theme-switch.tsx";
import { getUser } from "#app/utils/auth.server";
import { getHints } from "#app/utils/client-hints";
import { honeypot } from "#app/utils/honeypot.server";
import { getTheme } from "#app/utils/theme.server";

import "#app/styles/shared.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: reactMenuStyles, as: "style" },
  { rel: "stylesheet", href: reactMenuTransitions, as: "style" },
];

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
      honeypotInputProps: await honeypot.getInputProps(),
      requestInfo: {
        hints: getHints(request),
        path: new URL(request.url).pathname, // progressive enhancement
        userPrefs: {
          theme: getTheme(request),
        },
      },
    },
    { headers },
  );
};

// ----------------------------------------------------------------------------
// App
// ----------------------------------------------------------------------------
function App() {
  const { toast } = useLoaderData<LoaderData>();
  const theme = useTheme();

  useEffect(() => {
    if (toast?.type) {
      notify[toast?.type](toast.message);
    }
  }, [toast]);

  return (
    <>
      <Document theme={theme}>
        <Outlet />

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme}
          transition={Slide}
        />
      </Document>
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
  return (
    <Document>
      <ErrorBoundaryRoot />
    </Document>
  );
}

export function HydrateFallback() {
  return <h1>Loading...</h1>;
}
