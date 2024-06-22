// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { parseArgs } from "node:util";

import { createSeedClient } from "@snaplet/seed";
import bcrypt from "bcryptjs";

import {
  getPermissionsForRole,
  getSeedPermissions,
} from "#app/utils/permissions.server";
import { Role } from "#app/utils/permissions.types";
import { cuid, permaLink } from "#prisma/seed/seed-utils";
import seedConfig from "#prisma/seed/seed.config";

// --------------------------------------------------------------------------
// Variables
// --------------------------------------------------------------------------
const updatedAt = null;
const updatedBy = null;

const accounts = [
  {
    name: "admin",
    email: "admin@remix.run",
    password: "adminpassword",
    description: "Administrators",
  },
  {
    name: "moderator",
    email: "moderator@remix.run",
    password: "moderatorpassword",
    description: "Moderators",
  },
  {
    name: "user",
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
  const adminPermissions = getPermissionsForRole(
    seedPermissions,
    "admin" as unknown as Role,
  );
  const moderatorPermissions = getPermissionsForRole(
    seedPermissions,
    "moderator" as unknown as Role,
  );
  const userPermissions = getPermissionsForRole(
    seedPermissions,
    "user" as unknown as Role,
  );

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
          B: cuid(
            accounts
              .filter((account) => account.name === "admin")
              .map(({ email }) => email)
              .toString(),
          ),
        },
      ],
    },
    {
      id: cuid("moderator"),
      name: "moderator",
      description: "Moderators",
      _PermissionToRole: moderatorPermissions.map((permission) => ({
        A: permission.id, // RBAC
      })),
      _RoleToUser: prod === false && [
        {
          B: cuid(
            accounts
              .filter((account) => account.name === "moderator")
              .map(({ email }) => email)
              .toString(),
          ),
        },
      ],
    },
    {
      id: cuid("user"),
      name: "user",
      description: "Users",
      _PermissionToRole: userPermissions.map((permission) => ({
        A: permission.id, // RBAC
      })),
      _RoleToUser: prod === false && [
        {
          B: cuid(
            accounts
              .filter((account) => account.name === "user")
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
            .filter((account) => account.name === "admin")
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
        updatedBy,
        createdBy: cuid(
          accounts
            .filter((account) => account.name === "admin")
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
              .filter((account) => account.name === "admin")
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
  const movies = ["Movie1", "Movie2", "Movie3"];

  if (prod === false) {
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
