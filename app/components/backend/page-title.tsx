import { Button } from "#app/components/shared/button";
import { RoutePermission } from "#app/permissions/permission.types";
import { cn } from "#app/utils/lib/cn";
import { useUser, userHasRoutePermission } from "#app/utils/user";

interface PropTypes {
  title: string;
  className?: string;
  button?: {
    title: string;
    to: RoutePermission["resource"];
    scope: RoutePermission["scope"];
  };
  search?: boolean;
}

export const BackendPageTitle = ({
  title,
  search = false,
  button,
  className,
  ...rest
}: PropTypes) => {
  const user = useUser();

  return (
    <>
      {/* Header */}
      <div
        className={cn(
          "ml-5 pb-5 grid sm:flex sm:justify-between sm:items-center gap-2",
          className
        )}
        {...rest}
      >
        <h1 className="mt-2 h-[2.1rem] text-lg font-semibold text-gray-800 dark:text-neutral-200">
          {title}
        </h1>

        {/* Form Group */}
        <div className="flex items-center gap-x-2 sm:justify-end">
          {/* Search */}
          {search && (
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-3">
                <svg
                  className="size-4 shrink-0 text-gray-500 dark:text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-40 rounded-lg border-transparent bg-gray-100 px-3 py-1.5 ps-8 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 sm:w-full dark:border-transparent dark:bg-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
                placeholder="Search"
              />
            </div>
          )}
          {/* End Search */}

          {/* Button */}
          {button &&
            userHasRoutePermission(user, {
              resource: button.to,
              scope: button.scope
            }) && <Button type="button" text={button.title} to={button.to} />}
          {/* End Conditional New Button  */}
        </div>
        {/* End Form Group  */}
      </div>
      {/* End Header  */}
    </>
  );
};
