import { parseArgs } from "node:util";

import { createSeedClient } from "@snaplet/seed";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { movieSchemaFull } from "#app/validations/movie-schema";

import { cuid } from "./utils";

const adminEmail = "rachel@remix.run";
const adminPassword = "racheliscool";
const updatedAt = null; // TODO waits for snaplet fix

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
  // Movies
  // --------------------------------------------------------------------------
  const movieSeedSchema = movieSchemaFull.pick({
    id: true,
    name: true,
    slug: true,
    updatedAt: true,
  });

  type MovieType = z.infer<typeof movieSeedSchema>;

  type MoviesType = Record<string, MovieType>[];

  const movies: MoviesType = [
    {
      movie1: {
        id: cuid("Movie 1"),
        name: "Movie 1",
        slug: "ZWDM0Q",
        updatedAt,
      },
    },
    {
      movie2: {
        id: cuid("Movie 2"),
        name: "Movie 2",
        slug: "Z8K3A7",
        updatedAt,
      },
    },
    {
      movie3: {
        id: cuid("Movie 3"),
        name: "Movie 3",
        slug: "ZDUM3C",
        updatedAt,
      },
    },
  ];

  await seed.movie(
    movies.map((movie) => {
      return movie[Object.keys(movie)[0]]; // TODO updatedAt waits for snaplet fix
    }),
  );

  // --------------------------------------------------------------------------
  // PermaLinks
  // --------------------------------------------------------------------------
  await seed.permaLink(
    movies.map((movie) => {
      return { slug: movie[Object.keys(movie)[0]].slug };
    }),
  );

  // --------------------------------------------------------------------------
  // Exit seeding
  // --------------------------------------------------------------------------
  console.log("Database seeded successfully!");

  process.exit();
};

main();
