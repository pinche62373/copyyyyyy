import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import {
  type Theme,
  ThemeProvider,
  PreventFlashOnWrongTheme,
  useTheme,
} from "remix-themes";

import { LoaderData } from "#app/root";

export function Layout({ children }: { children: React.ReactNode }) {
  let data = useRouteLoaderData<LoaderData | { theme: Theme }>("root");

  // required for hard 404 errors
  if (typeof window !== "undefined") {
    if (data) {
      localStorage.setItem("theme", data.theme as Theme);
    } else {
      data = { theme: localStorage.getItem("theme") as Theme };
    }
  }

  return (
    <ThemeProvider
      specifiedTheme={data?.theme as Theme}
      themeAction="/action/set-theme"
    >
      <InnerLayout ssrTheme={Boolean(data?.theme)}>{children}</InnerLayout>
    </ThemeProvider>
  );
}

function InnerLayout({
  ssrTheme,
  children,
}: {
  ssrTheme: boolean;
  children: React.ReactNode;
}) {
  const [theme] = useTheme();

  return (
    <html lang="en" data-theme={theme ?? ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(ssrTheme)} />
        <Links />
      </head>
      <body
        className="bg-white text-black dark:bg-neutral-800 dark:text-white"
        suppressHydrationWarning
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
