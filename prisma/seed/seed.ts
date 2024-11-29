// @ts-nocheck

import { parseArgs } from "node:util";

import { createSeedClient } from "@snaplet/seed";
import bcrypt from "bcryptjs";

import {
  getPermissionsForRole,
  getSeedPermissions,
} from "#app/utils/permissions.server";
import { Roles } from "#app/validations/role-schema";
import { cuid, permaLink } from "#prisma/seed/seed-utils";
import seedConfig from "#prisma/seed/seed.config";

// --------------------------------------------------------------------------
// Variables
// --------------------------------------------------------------------------
const updatedAt = null;
const updatedBy = null;

const accounts = [
  {
    name: Roles.ADMIN,
    email: "admin@remix.run",
    password: "adminpassword",
    description: "Administrators",
  },
  {
    name: Roles.MODERATOR,
    email: "moderator@remix.run",
    password: "moderatorpassword",
    description: "Moderators",
  },
  {
    name: Roles.USER,
    email: "user@remix.run",
    password: "userpassword",
    description: "Users",
  },
];

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

  console.log(dryRun ? "Dry running" : "Not dry running");

  // --------------------------------------------------------------------------
  // Handle production mode
  // --------------------------------------------------------------------------
  const prod = process.env.NODE_ENV === "production" ? true : false;

  console.log(prod ? "Running production mode" : "Not running production mode");

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
  if (prod === false) {
    await seed.user(
      accounts.map((account) => {
        return {
          id: cuid(account.email),
          email: account.email,
          username: account.name,
          updatedAt,
          password: (x) =>
            x(1, {
              hash: bcrypt.hashSync(account.password, 10), // bcrypt sync mode
            }),
        };
      }),
    );
  }

  // --------------------------------------------------------------------------
  // Permissions (ALWAYS)
  // --------------------------------------------------------------------------
  const seedPermissions = getSeedPermissions();

  await seed.permission(seedPermissions);

  // --------------------------------------------------------------------------
  // Roles (ALWAYS) with Permissions (ALWAYS) and _RoleToUSer (DEV ONLY)
  // --------------------------------------------------------------------------
  const adminPermissions = getPermissionsForRole(seedPermissions, Roles.ADMIN);
  const moderatorPermissions = getPermissionsForRole(
    seedPermissions,
    Roles.MODERATOR,
  );
  const userPermissions = getPermissionsForRole(seedPermissions, Roles.USER);

  await seed.role([
    {
      id: cuid(Roles.ADMIN),
      name: Roles.ADMIN,
      description: "Administrators",
      _PermissionToRole: adminPermissions.map((permission) => ({
        A: permission.id, // RBAC
      })),
      _RoleToUser: prod === false && [
        {
          B: cuid(
            accounts
              .filter((account) => account.name === Roles.ADMIN)
              .map(({ email }) => email)
              .toString(),
          ),
        },
      ],
    },
    {
      id: cuid(Roles.MODERATOR),
      name: Roles.MODERATOR,
      description: "Moderators",
      _PermissionToRole: moderatorPermissions.map((permission) => ({
        A: permission.id, // RBAC
      })),
      _RoleToUser: prod === false && [
        {
          B: cuid(
            accounts
              .filter((account) => account.name === Roles.MODERATOR)
              .map(({ email }) => email)
              .toString(),
          ),
        },
      ],
    },
    {
      id: cuid(Roles.USER),
      name: Roles.USER,
      description: "Users",
      _PermissionToRole: userPermissions.map((permission) => ({
        A: permission.id, // RBAC
      })),
      _RoleToUser: prod === false && [
        {
          B: cuid(
            accounts
              .filter((account) => account.name === Roles.USER)
              .map(({ email }) => email)
              .toString(),
          ),
        },
      ],
    },
  ]);

  // --------------------------------------------------------------------------
  // Languages (DEV ONLY)
  // --------------------------------------------------------------------------
  if (prod === false) {
    const languages = [
      "English",
      "Russian",
      "Portugese",
      "Chinese",
      "Hungarian",
    ];

    await seed.language(
      languages.map((language) => ({
        id: cuid(language),
        name: language,
        updatedAt,
        updatedBy,
        createdBy: cuid(
          accounts
            .filter((account) => account.name === Roles.ADMIN)
            .map(({ email }) => email)
            .toString(),
        ),
      })),
    );
  }

  // --------------------------------------------------------------------------
  // Regions (DEV ONLY) and Countries (DEV ONLY)
  // --------------------------------------------------------------------------
  if (prod === false) {
    const regions = [
      {
        name: "Asia",
      },
      {
        name: "Europe",
        countries: ["France", "Portugal"],
      },
      {
        name: "Africa",
      },
      {
        name: "South America",
        countries: ["Colombia"],
      },
      {
        name: "Russia",
        countries: ["Russia"],
      },
    ];

    await seed.region(
      regions.map((region) => ({
        id: cuid(region.name),
        name: region.name,
        updatedAt,
        updatedBy,
        createdBy: cuid(
          accounts
            .filter((account) => account.name === Roles.ADMIN)
            .map(({ email }) => email)
            .toString(),
        ),
        countries: region.countries?.map((country) => ({
          id: cuid(country),
          name: country,
          updatedAt,
          updatedBy,
          createdBy: cuid(
            accounts
              .filter((account) => account.name === Roles.ADMIN)
              .map(({ email }) => email)
              .toString(),
          ),
        })),
      })),
    );
  }

  // --------------------------------------------------------------------------
  // Movies (DEV ONLY)
  // --------------------------------------------------------------------------
  const movies = ["Movie 1", "Movie 2", "Movie 3"];

  if (prod === false) {
    await seed.movie(
      movies.map((movie) => ({
        id: cuid(movie),
        name: movie,
        slug: permaLink(movie),
        updatedAt,
        updatedBy,
        createdBy: cuid(
          accounts
            .filter((account) => account.name === Roles.ADMIN)
            .map(({ email }) => email)
            .toString(),
        ),
      })),
    );
  }

  // --------------------------------------------------------------------------
  // PermaLinks (DEV ONLY)
  // --------------------------------------------------------------------------
  if (prod === false) {
    await seed.permaLink(movies.map((movie) => ({ slug: permaLink(movie) })));
  }

  // --------------------------------------------------------------------------
  // Exit seeding
  // --------------------------------------------------------------------------
  console.log("Database seeded successfully!");

  process.exit();
};

main();
