import React from "react";
import Drawer from "react-modern-drawer";
import { BackendSidebar } from "#app/components/backend/sidebar/sidebar";
import { Breadcrumbs } from "#app/components/shared/breadcrumbs";
import { UserMenu } from "#app/components/shared/user-menu";
import { ThemeSwitch } from "#app/routes/resources+/theme-switch.tsx";
import { cn } from "#app/utils/lib/cn";
import { useRequestInfo } from "#app/utils/request-info.ts";

interface Props {
  className?: string;
}

export const BackendHeader = ({ className }: Props) => {
  const requestInfo = useRequestInfo();

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex flex-wrap md:flex-nowrap md:justify-start lg:ms-[260px]",
          "border-b border-border bg-foreground",
          className,
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
              <Breadcrumbs />
            </div>

            {/* Mobile - Open Drawer Button */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={toggleDrawer}
                className={cn(
                  "ml-2 h-8 w-8 p-3",
                  "inline-flex items-center justify-center gap-x-2 rounded-lg border text-sm font-medium shadow-sm",
                  "focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  "bg-input border-border-foreground text-secondary-foreground hover:bg-input/80 focus:bg-input",
                )}
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
            </div>
            {/* End Mobile - Open Drawer Button */}
          </div>
          {/* End Menu Left */}

          {/* Menu Right */}
          <div className="flex items-center justify-end gap-x-2 xl:col-span-2">
            <div className="flex items-center">
              {/* Theme Toggler */}
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
      </header>

      {/* Mobile - Drawer */}
      <Drawer
        customIdSuffix="MobileSidebar"
        open={isOpen}
        onClose={toggleDrawer}
        direction="left"
      >
        <BackendSidebar
          className={isOpen ? "visible" : "invisible"}
          onClick={toggleDrawer}
        />
      </Drawer>
      {/* End Mobile - Drawer */}
    </>
  );
};
