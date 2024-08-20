import { Breadcrumbs } from "#app/components/shared/breadcrumbs";
import { DarkModeToggler } from "#app/components/shared/darkmode-toggler";
import { UserMenu } from "#app/components/shared/user-menu";
import { cn } from "#app/utils/misc";

interface Props {
  className?: string;
}

export const BackendHeader = ({ className }: Props) => {
  return (
    <header
      className={cn(
        "lg:ms-[260px] fixed top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700",
        className,
      )}
    >
      {/* Global Div */}
      <div
        className="flex justify-between xl:grid xl:grid-cols-3 basis-full items-center w-full py-2.5 px-2 sm:px-5"
        aria-label="Global"
      >
        {/* Menu Left */}
        <div className="xl:col-span-1 flex items-center md:gap-x-3">
          <div className="items-left hidden lg:block">
            <Breadcrumbs
              routes={[
                { path: "/", breadcrumb: null },
                { path: "/admin", breadcrumb: "Home" },
                { path: "/admin/rbac", props: { noLink: true } },
                { path: "/admin/rbac/resources", props: { noLink: true } },
              ]}
            />
          </div>

          <div className="lg:hidden">
            {/* Sidebar Toggle */}
            <button
              type="button"
              className="w-7 h-[38px] inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              data-hs-overlay="#hs-pro-sidebar"
              aria-controls="hs-pro-sidebar"
              aria-label="Toggle navigation"
            >
              <svg
                className="flex-shrink-0 size-4"
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            {/* End Sidebar Toggle */}
          </div>
        </div>
        {/* End Menu Left */}

        {/* Menu Right */}
        <div className="xl:col-span-2 flex justify-end items-center gap-x-2">
          <div className="flex items-center">
            {/* Icon List */}
            <div className="h-[38px] flex">
              <DarkModeToggler className="size-[38px] inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" />

              <UserMenu />
            </div>
            {/* End Icon List */}
          </div>
        </div>
        {/* End Menu Right */}
      </div>
      {/* End Global Div */}
    </header>
  );
};
