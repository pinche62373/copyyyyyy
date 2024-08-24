import { NavLink } from "@remix-run/react";

import { DarkModeToggler } from "#app/components/shared/darkmode-toggler";
import { UserMenu } from "#app/components/shared/user-menu";
import { cn } from "#app/utils/lib/cn";

interface Props {
  className?: string;
}

export const FrontendHeader = ({ className }: Props) => {
  return (
    <header className="w-full dark:bg-neutral-900">
      <div
        className={cn(
          "max-w-[80rem] basis-full items-center w-full mx-auto px-4 sm:px-6 mb-6 lg:px-8 bg-red-200 flex flex-wrap md:justify-start md:flex-nowrap z-50 dark:bg-neutral-900",
          className,
        )}
      >
        {/* Global Div */}
        <div
          className="flex justify-between xl:grid xl:grid-cols-3 basis-full items-center w-full py-2.5"
          aria-label="Global"
        >
          {/* Menu Left */}
          <div className="xl:col-span-1 flex items-center md:gap-x-3">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
              aria-label="Preline"
            >
              Logo
            </NavLink>
            {/* End Logo */}
          </div>
          {/* End Menu Left */}

          {/* Menu Right */}
          <div className="xl:col-span-2 flex justify-end items-center gap-x-2">
            <div className="flex items-center">
              {/* Icon List */}
              <div className="h-[38px] flex">
                <DarkModeToggler />

                <UserMenu />
              </div>
              {/* End Icon List */}
            </div>
          </div>
          {/* End Menu Right */}
        </div>
        {/* End Global Div */}
      </div>
    </header>
  );
};
