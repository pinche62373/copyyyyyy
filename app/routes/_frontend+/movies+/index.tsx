import { NavLink, useLoaderData } from "react-router";
import { FrontendSection } from "#app/components/frontend/section";
import { Icon } from "#app/components/ui/icon.tsx";
import { getMovies } from "#app/models/movie.server";

export const loader = async () => {
  const movies = await getMovies();

  return { movies };
};

export default function MovieIndexPage() {
  const { movies } = useLoaderData<typeof loader>();

  return (
    <>
      <div
        className="text-md bg-red-50 border border-1 border-l-4 rounded-md border-red-200 border-l-red-500 text-neutral-700 p-5 pt-3 pb-4"
        role="alert"
      >
        {/* 
          https://v1.tailwindcss.com/components/alerts
         */}
        <div className="flex align-middle">
          {/* Icon button */}
          <div className="py-1">
            <svg
              className="fill-current h-6 w-6 text-red-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
            </svg>
          </div>
          {/* Message */}
          <div>
            <p className="font-bold mb-1">Form data rejected by server</p>
            {/* <p>
              Sorry, our servers are down and we cannot process your request.
            </p> */}
          </div>
        </div>
        {/* Close button */}
        <span className="absolute top-0 bottom-0 right-0 px-3 py-3 mt-20">
          <svg
            className="fill-current h-6 w-6 text-neutral-800"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>

      <FrontendSection>
        <h1 className="mb-4">Movie Index:</h1>

        <ul className="ml-10 list-disc">
          {movies.map((movie, i) => (
            <li key={i}>
              <NavLink to={movie.id}>{movie.name}</NavLink>
              <span className="px-5">-</span>
              <NavLink to={`/${movie.permalink}`}>{movie.permalink}</NavLink>
            </li>
          ))}
        </ul>

        {/* Test icon alignment */}
        <ul>
          <li>
            <Icon name="home" />
          </li>
          <li className="text-lg">
            <Icon name="home">Home</Icon>
          </li>

          <li className="text-lg">
            <Icon name="checkmark" />
          </li>

          <li className="text-lg">
            <Icon name="home">Home</Icon>
          </li>
        </ul>
      </FrontendSection>
    </>
  );
}
