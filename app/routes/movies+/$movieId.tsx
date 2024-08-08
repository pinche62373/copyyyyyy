import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { getMovie } from "#app/models/movie.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const movieId = z.coerce.string().parse(params.movieId);
  const movie = await getMovie({ id: movieId });

  if (!movie) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return json({ movie });
}

export default function Component() {
  const { movie } = useLoaderData<typeof loader>();

  return (
    <>
      <AdminContentCard className="p-6">
        <ul>
          <li>Title: {movie.name}</li>
          <li>Slug: {movie.slug}</li>
        </ul>
      </AdminContentCard>
    </>
  );
}
