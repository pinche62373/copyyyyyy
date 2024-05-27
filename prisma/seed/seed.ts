// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { parseArgs } from "node:util";

import { createSeedClient } from "@snaplet/seed";
import bcrypt from "bcryptjs";

import { findRbacPermissions, getRbacPermissions } from "./rbac";
import { cuid, permaLink } from "./utils";

// --------------------------------------------------------------------------
// Variables
// --------------------------------------------------------------------------
const updatedAt = null;
const accounts = {
  admin: {
    email: "rachel@remix.run",
    password: "racheliscool",
  },
  user: {
    email: "candy@remix.run",
    password: "candyiscool",
  },
};

// --------------------------------------------------------------------------
// Command line arguments
// --------------------------------------------------------------------------
const options = {
  force: {
    type: "boolean",
  },
  prod: {
    type: "boolean",
  },
} as const;

const main = async () => {
  const {
    values: { force, prod },
  } = parseArgs({ options });

  // Execute dry run unless --force argument was passed
  const dryRun = force === true ? false : true;

  dryRun ? console.log("Dry running") : console.log(`Not dry running`);
  prod
    ? console.log("Running production mode")
    : console.log(`Not running production mode`);

  const seed = await createSeedClient({
    dryRun,
  });

  // --------------------------------------------------------------------------
  // Truncate tables specified in the config
  // --------------------------------------------------------------------------
  await seed.$resetDatabase();

  // --------------------------------------------------------------------------
  // User with Password - DEV ONLY
  // --------------------------------------------------------------------------
  const hashedAdminPassword = await bcrypt.hash(accounts.admin.password, 10);
  const hashedUserPassword = await bcrypt.hash(accounts.user.password, 10);

  if (!prod) {
    await seed.user([
      {
        id: cuid(accounts.admin.email),
        email: accounts.admin.email,
        updatedAt,
        password: (x) =>
          x(1, {
            hash: hashedAdminPassword,
          }),
      },
      {
        id: cuid(accounts.user.email),
        email: accounts.user.email,
        updatedAt,
        password: (x) =>
          x(1, {
            hash: hashedUserPassword,
          }),
      },
    ]);
  }

  // --------------------------------------------------------------------------
  // Permissions
  // --------------------------------------------------------------------------
  await seed.permission(getRbacPermissions());

  // --------------------------------------------------------------------------
  // Roles with Permissions
  // --------------------------------------------------------------------------
  const adminPermissions = findRbacPermissions({
    store: seed.$store,
    field: "access",
    value: "any",
  });

  await seed.role([
    {
      id: cuid("admin"),
      name: "admin",
      description: "Administrators",
      _PermissionToRole: adminPermissions.map((permission) => ({
        A: permission.id,
      })), // RBAC
      _RoleToUser: [
        {
          B: cuid(accounts.admin.email),
        },
      ],
    },
    {
      id: cuid("user"),
      name: "user",
      description: "Users",
      _RoleToUser: [
        {
          B: cuid(accounts.user.email),
        },
      ],
    },
    {
      id: cuid("moderator"),
      name: "moderator",
      description: "Moderators",
    },
  ]);

  // --------------------------------------------------------------------------
  // Languages - DEV ONLY
  // --------------------------------------------------------------------------
  const languages = ["English", "Russian", "Portugese", "Chinese", "Hungarian"];

  if (!prod) {
    await seed.language(
      languages.map((language) => ({
        id: cuid(language),
        name: language,
        updatedAt,
      })),
    );
  }

  // --------------------------------------------------------------------------
  // Regions (ALWAYS) with Countries (DEV-ONLY)
  // --------------------------------------------------------------------------
  const regions = [
    {
      name: "Asia",
    },
    {
      name: "Europe",
      countries: ["Russia", "France", "Portugal"],
    },
    {
      name: "Africa",
    },
    {
      name: "Latin America",
      countries: ["Colombia"],
    },
  ];

  await seed.region(
    regions.map((region) => ({
      id: cuid(region.name),
      name: region.name,
      updatedAt,
      countries:
        prod === true
          ? undefined
          : region.countries?.map((country) => ({
              id: cuid(country),
              name: country,
              updatedAt,
            })),
    })),
  );

  // --------------------------------------------------------------------------
  // Movies - DEV ONLY
  // --------------------------------------------------------------------------
  const movies = ["Movie1", "Movie2", "Movie3"];

  if (!prod) {
    await seed.movie(
      movies.map((movie) => ({
        id: cuid(movie),
        name: movie,
        slug: permaLink(movie),
        updatedAt,
      })),
    );
  }

  // --------------------------------------------------------------------------
  // PermaLinks - DEV ONLY
  // --------------------------------------------------------------------------
  if (!prod) {
    await seed.permaLink(movies.map((movie) => ({ slug: permaLink(movie) })));
  }

  // --------------------------------------------------------------------------
  // Exit seeding
  // --------------------------------------------------------------------------
  console.log("Database seeded successfully!");

  process.exit();
};

main();
