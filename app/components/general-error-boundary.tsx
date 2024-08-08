import {
  Link,
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "@remix-run/react";

import { Button } from "#app/components/admin/button";
import { getErrorMessage } from "#app/utils/misc";

export function GeneralErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div className="max-w-[50rem] flex flex-col mx-auto size-full">
      {/* <!-- ========== MAIN CONTENT ========== --> */}
      <main id="content" className="mt-10">
        <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
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

          <div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
            <Button
              text="Back"
              type="button"
              secondary
              onClick={goBack}
              className="py-1.5 px-3"
            />

            <Link
              type="button"
              className="w-full sm:w-auto py-1.5 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              to="/"
            >
              {" "}
              Home
            </Link>
          </div>
        </div>
      </main>

      {/* <!-- ========== FOOTER ========== --> */}
      <footer className="mt-auto text-center py-5">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 dark:text-neutral-500">
            © All Rights Reserved. 2024.
          </p>
        </div>
      </footer>
    </div>
  );
}
