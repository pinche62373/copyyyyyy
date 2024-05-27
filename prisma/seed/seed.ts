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
} as const;

const main = async () => {
  const {
    values: { force },
  } = parseArgs({ options });

  // Execute dry run unless --force argument was passed
  const dryRun = force === true ? false : true;

  dryRun ? console.log("Dry running") : console.log(`Not dry running`);

  const seed = await createSeedClient({
    dryRun,
  });

  // --------------------------------------------------------------------------
  // Truncate tables specified in the config
  // --------------------------------------------------------------------------
  await seed.$resetDatabase();

  // --------------------------------------------------------------------------
  // User with Password
  // --------------------------------------------------------------------------
  const hashedPassword = await bcrypt.hash(accounts.admin.password, 10);

  await seed.user([
    {
      id: cuid(accounts.admin.email),
      email: accounts.admin.email,
      updatedAt,
      password: (x) =>
        x(1, {
          hash: hashedPassword,
        }),
    },
    {
      id: cuid(accounts.user.email),
      email: accounts.user.email,
      updatedAt,
      password: (x) =>
        x(1, {
          hash: hashedPassword,
        }),
    },
  ]);

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
  // Languages
  // --------------------------------------------------------------------------
  const languages = ["English", "Russian", "Portugese", "Chinese", "Hungarian"];

  await seed.language(
    languages.map((language) => ({
      id: cuid(language),
      name: language,
      updatedAt,
    })),
  );

  // --------------------------------------------------------------------------
  // Regions with Countries
  // --------------------------------------------------------------------------
  await seed.region([
    {
      id: cuid("Asia"),
      name: "Asia",
      updatedAt,
    },
    {
      id: cuid("Europe"),
      name: "Europe",
      updatedAt,
      countries: [
        {
          id: cuid("Russia"),
          name: "Russia",
          updatedAt,
        },
        {
          id: cuid("France"),
          name: "France",
          updatedAt,
        },
        {
          id: cuid("Portugal"),
          name: "Portugal",
          updatedAt,
        },
      ],
    },
    {
      id: cuid("Africa"),
      name: "Africa",
      updatedAt,
    },
    {
      id: cuid("Latin America"),
      name: "Latin America",
      updatedAt,
      countries: [
        {
          id: cuid("Colombia"),
          name: "Colombia",
          updatedAt,
        },
      ],
    },
  ]);

  // --------------------------------------------------------------------------
  // Movies
  // --------------------------------------------------------------------------
  const movies = ["Movie1", "Movie2", "Movie3"];

  await seed.movie(
    movies.map((movie) => ({
      id: cuid(movie),
      name: movie,
      slug: permaLink(movie),
      updatedAt,
    })),
  );

  // --------------------------------------------------------------------------
  // PermaLinks
  // --------------------------------------------------------------------------
  await seed.permaLink(movies.map((movie) => ({ slug: permaLink(movie) })));

  // --------------------------------------------------------------------------
  // Exit seeding
  // --------------------------------------------------------------------------
  console.log("Database seeded successfully!");

  process.exit();
};

main();
