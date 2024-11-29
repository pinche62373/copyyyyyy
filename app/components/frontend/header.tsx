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
              aria-label="Preline"
            >
              Logo
            </NavLink>
            {/* End Logo */}
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
      </div>
    </header>
  );
};
