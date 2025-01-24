# React Router Hono Server

This folder contains files related to [Hono](https://hono.dev/) as powered by [react-router-hono-server](https://github.com/rphlmr/react-router-hono-server).

## Configuration

By default, Hono runs in [Easy Mode](https://github.com/rphlmr/react-router-hono-server?tab=readme-ov-file#easy-mode).

If you want to customize your server or need middlewares:

- Do not update [index.ts](index.ts).
- Instead, create `config.ts` with your customizations. For inspiration, see this [config.example.ts](config.example.ts).
