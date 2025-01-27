import { NavLink } from "react-router";
import { UserMenu } from "#app/components/shared/user-menu";
import { ThemeSwitch } from "#app/routes/resources+/theme-switch.tsx";
import { cn } from "#app/utils/lib/cn";
import { useRequestInfo } from "#app/utils/request-info.ts";

interface Props {
  className?: string;
}

export const FrontendHeader = ({ className }: Props) => {
  const requestInfo = useRequestInfo();

  return (
    <header className="w-full dark:bg-neutral-900">
      <div
        className={cn(
          "mx-auto mb-6 w-full max-w-[80rem] basis-full items-center px-4 sm:px-6 lg:px-8",
          "z-50 flex flex-wrap bg-red-200 md:flex-nowrap md:justify-start dark:bg-neutral-900",
          className,
        )}
      >
        {/* Global Div */}
        <div
          className="flex w-full basis-full items-center justify-between py-2.5 xl:grid xl:grid-cols-3"
          aria-label="Global"
        >
          {/* Menu Left */}
          <div className="flex items-center md:gap-x-3 xl:col-span-1">
            {/* Logo */}
            <NavLink
              to="/"
              className="inline-block flex-none rounded-md text-xl font-semibold focus:opacity-80 focus:outline-none"
              aria-label="Home"
            >
              Logo
            </NavLink>
            {/* End Logo */}
          </div>
          {/* End Menu Left */}

          {/* Menu Right */}
          <div className="flex items-center justify-end gap-x-2 xl:col-span-2">
            <div className="flex items-center">
              {/* Theme Toggler  */}
              <ThemeSwitch
                userPreference={requestInfo.userPrefs.theme}
                className={cn(
                  "inline-flex size-[38px] items-center justify-center gap-x-2 rounded-full border border-transparent",
                  "text-gray-500 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
                )}
              />
              {/* End Theme Toggler */}

              {/* User Dropdown */}
              <div className="flex h-[38px]">
                <UserMenu />
              </div>
              {/* End User Dropdown */}
            </div>
          </div>
          {/* End Menu Right */}
        </div>
        {/* End Global Div */}
      </div>
    </header>
  );
};
