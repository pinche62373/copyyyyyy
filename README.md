# Base Stack

This repo contains the upstream `Base Stack`.

## Components

| Component       | Solution                                                                                               |
|-----------------|--------------------------------------------------------------------------------------------------------|
| Language        | [Typescript](https://typescriptlang.org)                                                               |
| Framework       | [React Router](https://github.com/remix-run/react-router)                                              |
| Database        | [SQLite](https://sqlite.org)                                                                           |
| Styling         | [Tailwind](https://tailwindcss.com/)                                                                   |
| Code Formatting | [Biome](https://biomejs.dev/) and [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2) |
| Testing         | [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)                        |
| Web Server      | [Hono](https://hono.dev/)                                                                              |
| CI              | [GitHub Actions](https://github.com/features/actions)                                                  |
| Authentication  | [Remix Auth](https://github.com/sergiodxa/remix-auth)                                                  |

## Quickstart

```bash
npm install
npm run postmigrate
npm run seed -- -- --force
npm run dev
```

Your SQLite database file is now located at [./prisma/data.db](./prisma/data.db).

You can log in to [http://localhost:5173](http://localhost:5173) using one of these three seeded accounts:

| Username | Email                                      | Password          |
|----------|--------------------------------------------|-------------------|
| user     | [user@remix.run](user@remix.run)           | userpassword      |
| moderator| [moderator@remix.run](moderator@remix.run) | moderatorpassword |
| admin    | [admin@remix.run](admin@remix.run)         | adminpassword     |

## Developing

- **Testing:** see npm run scripts in [package.json](./package.json)
- **Seeding:** see readme in [./prisma/seed](./prisma/seed/README.md)
