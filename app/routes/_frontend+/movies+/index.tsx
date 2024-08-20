import { useLoaderData, NavLink } from "@remix-run/react";

import { FrontendContentContainer } from "#app/components/frontend/content-container";
import { getMovies } from "#app/models/movie.server";

export const loader = async () => {
  const movies = await getMovies();

  return { movies };
};

export default function MovieIndexPage() {
  const { movies } = useLoaderData<typeof loader>();

  return (
    <>
      <FrontendContentContainer>
        <h1 className="mb-4">Movie Index:</h1>

        <ul className="ml-10 list-disc">
          {movies.map((movie, i) => (
            <li key={i}>
              <NavLink to={movie.id}>{movie.name}</NavLink>
              <span className="px-5">-</span>
              <NavLink to={`/${movie.slug}`}>{movie.slug}</NavLink>
            </li>
          ))}
        </ul>
      </FrontendContentContainer>
    </>
  );
}
