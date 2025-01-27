import type { Movie } from "prisma-client";

import { prisma } from "#app/utils/db.server";

const model = "movie";

export function getMovie({ id }: Pick<Movie, "id">) {
  return prisma[model].findFirst({
    where: { id },
  });
}

export function getMovieIdByPermalink({ permalink }: Pick<Movie, "permalink">) {
  return prisma[model].findFirst({
    select: { id: true },
    where: { permalink },
  });
}

export function getMovies() {
  return prisma[model].findMany({
    orderBy: { name: "asc" },
  });
}
