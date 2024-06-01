// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { parseArgs } from "node:util";

import { createSeedClient } from "@snaplet/seed";
import bcrypt from "bcryptjs";

import { getRbacSeedPermissions } from "#app/utils/rbac-permissions";

import seedConfig from "./seed.config";
import { cuid, findRbacPermissions, permaLink } from "./utils";

// --------------------------------------------------------------------------
// Variables
// --------------------------------------------------------------------------
const updatedAt = null;
const accounts = {
  admin: {
    email: "admin@remix.run",
    password: "adminpassword",
  },
  moderator: {
    email: "moderator@remix.run",
    password: "moderatorpassword",
  },
  user: {
    email: "user@remix.run",
    password: "userpassword",
  },
};

// --------------------------------------------------------------------------
// Command line arguments --force
// --------------------------------------------------------------------------
const options = {
  force: {
    type: "boolean",
  },
} as const;

const main = async () => {
  const {
    values: { force },
  } = parseArgs({ options });

  // Execute dry run unless --force argument was passed
  const dryRun = force === true ? false : true;

  dryRun ? console.log("Dry running") : console.log(`Not dry running`);

  // --------------------------------------------------------------------------
  // Handle production mode
  // --------------------------------------------------------------------------
  const prod = process.env.NODE_ENV === "production" ? true : false;

  prod
    ? console.log("Running production mode")
    : console.log(`Not running production mode`);

  // --------------------------------------------------------------------------
  // Create seed client
  // --------------------------------------------------------------------------
  const seed = await createSeedClient({
    dryRun,
  });

  // --------------------------------------------------------------------------
  // Truncate tables as specified in the config
  // --------------------------------------------------------------------------
  console.log("Using tables:");
  console.log(seedConfig.select);

  await seed.$resetDatabase(seedConfig.select);

  // --------------------------------------------------------------------------
  // User with Password (DEV ONLY)
  // --------------------------------------------------------------------------
  const hashedAdminPassword = await bcrypt.hash(accounts.admin.password, 10);
  const hashedModeratorPassword = await bcrypt.hash(
    accounts.moderator.password,
    10,
  );
  const hashedUserPassword = await bcrypt.hash(accounts.user.password, 10);

  if (prod === false) {
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
        id: cuid(accounts.moderator.email),
        email: accounts.moderator.email,
        updatedAt,
        password: (x) =>
          x(1, {
            hash: hashedModeratorPassword,
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
  // Permissions (ALWAYS)
  // --------------------------------------------------------------------------
  await seed.permission(getRbacSeedPermissions());

  // --------------------------------------------------------------------------
  // Roles (ALWAYS) with Permissions (ALWAYS) and _RoleToUSer (DEV ONLY)
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
        A: permission.id, // RBAC
      })),
      _RoleToUser: prod === false && [
        {
          B: cuid(accounts.admin.email),
        },
      ],
    },
    {
      id: cuid("moderator"),
      name: "moderator",
      description: "Moderators",
      _RoleToUser: prod === false && [
        {
          B: cuid(accounts.moderator.email),
        },
      ],
    },
    {
      id: cuid("user"),
      name: "user",
      description: "Users",
      _RoleToUser: prod === false && [
        {
          B: cuid(accounts.user.email),
        },
      ],
    },
  ]);

  // --------------------------------------------------------------------------
  // Languages (DEV ONLY)
  // --------------------------------------------------------------------------
  const languages = ["English", "Russian", "Portugese", "Chinese", "Hungarian"];

  if (prod === false) {
    await seed.language(
      languages.map((language) => ({
        id: cuid(language),
        name: language,
        updatedAt,
      })),
    );
  }

  // --------------------------------------------------------------------------
  // Regions (ALWAYS) with Countries (DEV ONLY)
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
        prod === false &&
        region.countries?.map((country) => ({
          id: cuid(country),
          name: country,
          updatedAt,
        })),
    })),
  );

  // --------------------------------------------------------------------------
  // Movies (DEV ONLY)
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
  // PermaLinks (DEV ONLY)
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
