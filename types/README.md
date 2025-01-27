# app/types

Types folder for any `.d.ts` file.

Typically with:

- `env.d.ts` holding the reference types for `vite`, `vitest` and other packages like `@remix-run/cloudflare`.
- `app.d.ts` with definition of global App namespace, interfaces of `handle` exports and overrides of AppLoadContext.
- any other type file as needed by the application.
