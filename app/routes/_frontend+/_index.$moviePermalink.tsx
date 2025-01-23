import { type LoaderFunctionArgs, redirect } from "react-router";
import invariant from "tiny-invariant";

import { getMovieIdByPermalink } from "#app/models/movie.server";
import { permalink as permalinkSchema } from "#app/validations/movie-schema";

/**
 * Loader only component used to redirect permalinks to movie pages.
 */
export async function loader({ params }: LoaderFunctionArgs) {
  const permalink = params.moviePermalink;

  try {
    invariant(permalink, "Must be set");
    permalinkSchema.parse(permalink);
  } catch (error) {
    throw new Response(`Not Found: ${error}`, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const movie = await getMovieIdByPermalink({ permalink });

  if (!movie) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  throw redirect(`/movies/${movie.id}`, 307);
}

// return something or errors will not render properly
export default function Component() {
  return <></>;
}
