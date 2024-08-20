import { Breadcrumbs } from "#app/components/shared/breadcrumbs";
import { DarkModeToggler } from "#app/components/shared/darkmode-toggler";
import { UserMenu } from "#app/components/shared/user-menu";
import { cn } from "#app/utils/misc";

interface Props {
  className?: string;
}

export const FrontendHeader = ({ className }: Props) => {
  return (
    <header
      className={cn(
        "max-w-[82rem] basis-full items-center w-full mx-auto px-4 sm:px-6 mb-6 lg:px-8 bg-red-200 flex flex-wrap md:justify-start md:flex-nowrap z-50 dark:bg-neutral-800",
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
                { path: "/", breadcrumb: "Home" },
                { path: "/movies", breadcrumb: "Movies" },
                // { path: "/admin/rbac", props: { noLink: true } },
                // { path: "/admin/rbac/resources", props: { noLink: true } },
              ]}
            />
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
