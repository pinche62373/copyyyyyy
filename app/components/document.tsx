import React from "react";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";
import { ClientHintCheck } from "#app/utils/client-hints";
import { type Theme } from "#app/utils/theme.server";

export function Document({
  children,
  theme = "light",
}: {
  children: React.ReactNode;
  theme?: Theme;
}) {
  return <InnerLayout theme={theme}>{children}</InnerLayout>;
}

function InnerLayout({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: Theme;
}) {
  return (
    <html lang="en" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ClientHintCheck />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
