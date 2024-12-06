import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { FrontendSection } from "#app/components/frontend/section";
import { getMovie } from "#app/models/movie.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const movieId = z.coerce.string().parse(params.movieId);
  const movie = await getMovie({ id: movieId });

  if (!movie) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return { movie };
}

export default function Component() {
  const { movie } = useLoaderData<typeof loader>();

  return (
    <>
      <FrontendSection>
        <ul>
          <li>Title: {movie.name}</li>
          <li>Slug: {movie.slug}</li>
          <li>CreatedBy: {movie.createdBy}</li>
        </ul>
      </FrontendSection>
    </>
  );
}
