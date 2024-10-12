import { Breadcrumbs } from "#app/components/shared/breadcrumbs";
import { DarkModeToggler } from "#app/components/shared/darkmode-toggler";
import { UserMenu } from "#app/components/shared/user-menu";
import { cn } from "#app/utils/lib/cn";

interface Props {
  className?: string;
}

export const BackendHeader = ({ className }: Props) => {
  return (
    <header
      className={cn(
        "lg:ms-[260px] fixed top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-neutral-800",
        className
      )}
    >
      {/* Global Div */}
      <div
        className="flex w-full basis-full items-center justify-between px-2 py-2.5 sm:px-5 xl:grid xl:grid-cols-3"
        aria-label="Global"
      >
        {/* Menu Left */}
        <div className="flex items-center md:gap-x-3 xl:col-span-1">
          <div className="hidden items-start lg:block">
            <Breadcrumbs
              routes={[
                { path: "/", breadcrumb: null },
                { path: "/admin", breadcrumb: "Home" },
                { path: "/admin/rbac", props: { noLink: true } },
                { path: "/admin/rbac/resources", props: { noLink: true } }
              ]}
            />
          </div>

          <div className="lg:hidden">
            {/* Sidebar Toggle */}
            <button
              type="button"
              className="inline-flex h-[38px] w-7 items-center justify-center gap-x-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              data-hs-overlay="#hs-pro-sidebar"
              aria-controls="hs-pro-sidebar"
              aria-label="Toggle navigation"
            >
              <svg
                className="size-4 shrink-0"
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
        <div className="flex items-center justify-end gap-x-2 xl:col-span-2">
          <div className="flex items-center">
            {/* Icon List */}
            <div className="flex h-[38px]">
              <DarkModeToggler />

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
