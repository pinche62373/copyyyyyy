import { Links, Meta, Scripts, ScrollRestoration } from "@remix-run/react";
import { clsx } from "clsx";

import { Theme, ThemeBody, ThemeHead } from "#app/utils/theme-provider";

export function Document({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: Theme | null;
}) {
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(theme)} />
      </head>
      <body className="h-full bg-gray-50 dark:bg-neutral-900">
        {children}
        <ThemeBody ssrTheme={Boolean(theme)} />
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}
