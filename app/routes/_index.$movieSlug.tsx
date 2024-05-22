import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getMovieIdBySlug } from "#app/models/movie.server";
import { slug as slugSchema } from "#app/validations/movie-schema";

export async function loader({ params }: LoaderFunctionArgs) {
  const movieSlug = params.movieSlug;

  try {
    invariant(movieSlug, "Must be set");
    slugSchema.parse(movieSlug);
  } catch (error) {
    throw new Response(`Not Found: ${error}`, { status: 404 });
  }

  const movie = await getMovieIdBySlug({ slug: movieSlug });

  if (!movie) {
    throw new Response("Not Found", { status: 404 });
  }

  throw redirect(`/movies/${movie.id}`, 307);
}

// return something or errors will not render properly
export default function Component() {
  return <></>;
}
