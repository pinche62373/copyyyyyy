import { Button } from "#app/components/admin/button";
import { cn } from "#app/utils/misc";
import { useUser, userHasPermission } from "#app/utils/user";

type PropTypes =
  | {
      title: string;
      search?: boolean;
      buttonText?: undefined;
      buttonTo?: undefined;
      className?: string;
    }
  | {
      title: string;
      search?: boolean;
      buttonText: string;
      buttonTo: string;
      className?: string;
    };

export const AdminPageTitle = ({
  title,
  buttonText,
  buttonTo,
  search = false,
  className,
  ...rest
}: PropTypes) => {
  const user = useUser();

  return (
    <>
      {/* Header */}
      <div
        className={cn(
          className,
          "ml-5 pb-5 grid sm:flex sm:justify-between sm:items-center gap-2",
        )}
        {...rest}
      >
        <h1 className="mt-2 h-[2.1rem] text-lg font-semibold text-gray-800 dark:text-neutral-200">
          {title}
        </h1>

        {/* Form Group */}
        <div className="flex sm:justify-end items-center gap-x-2">
          {/* Conditional Search */}
          {search && (
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3">
                <svg
                  className="flex-shrink-0 size-4 text-gray-500 dark:text-neutral-400"
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
                className="py-1.5 px-3 ps-8 w-40 sm:w-full block bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
                placeholder="Search"
              />
            </div>
          )}
          {/* End Conditional Search */}

          {/* Conditionally render new button BUT ONLY if set AND user has route permission */}
          {buttonText &&
            userHasPermission(user, {
              entity: buttonTo,
              action: "access",
              scope: "any",
            }) && (
              <Button type="button" text={buttonText} to={buttonTo} />
            )}
          {/* End Conditional New Button  */}
        </div>
        {/* End Form Group  */}
      </div>
      {/* End Header  */}
    </>
  );
};
