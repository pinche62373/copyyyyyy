import { parseArgs } from "node:util";

import { createSeedClient } from "@snaplet/seed";
import bcrypt from "bcryptjs";

import { cuid } from "./utils";

const adminEmail = "rachel@remix.run";
const adminPassword = "racheliscool";
const updatedAt = null;

// command line arguments
const options = {
  force: {
    type: "boolean",
  },
} as const;

const main = async () => {
  const {
    values: { force },
  } = parseArgs({ options });

  // --------------------------------------------------------------------------
  // Execute dry run unless --force argument was passed
  // --------------------------------------------------------------------------
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
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await seed.user([
    {
      id: cuid(adminEmail),
      email: adminEmail,
      updatedAt,
      password: (x) =>
        x(1, {
          hash: hashedPassword,
        }),
    },
  ]);

  // --------------------------------------------------------------------------
  // Languages
  // --------------------------------------------------------------------------
  await seed.language([
    {
      id: cuid("English"),
      name: "English",
      updatedAt,
    },
    {
      id: cuid("Russian"),
      name: "Russian",
      updatedAt,
    },
    {
      id: cuid("Portugese"),
      name: "Portugese",
      updatedAt,
    },
    {
      id: cuid("Chinese"),
      name: "Chinese",
      updatedAt,
    },
    {
      id: cuid("Hungarian"),
      name: "Hungarian",
      updatedAt,
    },
  ]);

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
  // Exit seeding
  // --------------------------------------------------------------------------
  console.log("Database seeded successfully!");

  process.exit();
};

main();
