import {
  Link,
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "@remix-run/react";

import { Button } from "#app/components/shared/button";
import { getErrorMessage } from "#app/utils/lib/get-error-message";

export function ErrorBoundaryRoot() {
  const error = useRouteError();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div className="mx-auto flex size-full max-w-[50rem] flex-col">
      {/* <!-- ========== MAIN CONTENT ========== --> */}
      <main id="content" className="mt-10">
        <div className="px-4 py-10 text-center sm:px-6 lg:px-8">
          {/* Status code */}
          <h1 className="block text-7xl font-bold text-gray-800 sm:text-9xl dark:text-white">
            {isRouteErrorResponse(error) ? error.status : 500}
          </h1>

          {/* Always show status text */}
          <p className="mt-3 text-gray-600 dark:text-neutral-400">
            {isRouteErrorResponse(error)
              ? error.statusText
              : "Internal Server Error"}
          </p>

          {/* Only show underlying error message in dev-mode */}
          {!isRouteErrorResponse(error) &&
            process.env.NODE_ENV !== "production" && (
              <p className="mt-5 text-gray-600 dark:text-neutral-400">
                {isRouteErrorResponse(error)
                  ? error.data
                  : getErrorMessage(error)}
              </p>
            )}

          <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
            <Button
              text="Back"
              type="button"
              secondary
              onClick={goBack}
              className="px-3 py-1.5"
            />

            <Link
              type="button"
              className="inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
              to="/"
            >
              {" "}
              Home
            </Link>
          </div>
        </div>
      </main>

      {/* <!-- ========== FOOTER ========== --> */}
      <footer className="mt-auto py-5 text-center">
        <div className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 dark:text-neutral-500">
            © All Rights Reserved. 2024.
          </p>
        </div>
      </footer>
    </div>
  );
}
