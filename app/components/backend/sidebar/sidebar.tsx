import { NavLink } from "@remix-run/react";

import { SidebarFooter } from "#app/components/backend/sidebar/sidebar-footer";
import { SidebarGroup } from "#app/components/backend/sidebar/sidebar-group";
import { SidebarLink } from "#app/components/backend/sidebar/sidebar-link";
import { SidebarSection } from "#app/components/backend/sidebar/sidebar-section";
import { IconEye } from "#app/components/icons/icon-eye";
import { IconHome } from "#app/components/icons/icon-home";
import { IconMovie } from "#app/components/icons/icon-movie";
import { IconUsers } from "#app/components/icons/icon-users";
import { cn } from "#app/utils/lib/cn";
import { Roles } from "#app/validations/role-schema";

export function BackendSidebar() {
  return (
    <aside
      id="hs-pro-sidebar"
      className={cn(
        "hs-overlay fixed inset-y-0 start-0 z-[60] hidden w-[260px] -translate-x-full",
        "transition-all duration-300 [--auto-close:lg] hs-overlay-open:translate-x-0",
        "lg:bottom-0 lg:end-auto lg:block lg:translate-x-0",
        "border-e border-border bg-foreground",
      )}
    >
      <div className="flex h-full max-h-full flex-col py-3">
        <header className="h-[46px] px-8">
          {/* Logo */}
          <NavLink
            to="/"
            className="inline-block flex-none rounded-md text-xl font-semibold text-sidebar-primary focus:opacity-80 focus:outline-none"
            aria-label="Preline"
          >
            Logo
          </NavLink>
          {/* End Logo */}
        </header>

        {/* Content Container */}
        <div
          className={cn(
            "h-[calc(100%-35px)] overflow-y-auto lg:h-[calc(100%-93px)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar]:w-2",
            "[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100",
            "dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:[&::-webkit-scrollbar-track]:bg-neutral-700",
          )}
        >
          {/* Section: Main */}
          <SidebarSection>
            <SidebarLink to="/admin">
              <IconHome />
              Dashboard
            </SidebarLink>

            {/* Group: Actors */}
            <SidebarGroup id="actors" caption="Actors" icon={<IconUsers />}>
              <SidebarLink to="#" nested>
                Overview
              </SidebarLink>

              <SidebarLink to="#" nested>
                Add User
              </SidebarLink>
            </SidebarGroup>

            {/* Link: Directors */}
            <SidebarLink to="#">
              <IconEye />
              Directors
            </SidebarLink>

            {/* Group: Movies */}
            <SidebarGroup id="movies" caption="Movies" icon={<IconMovie />}>
              <SidebarLink to="#" nested>
                Overview
              </SidebarLink>

              <SidebarLink to="#" nested>
                Add Movie
              </SidebarLink>
            </SidebarGroup>

            {/* Link: Publishers */}
            <SidebarLink to="#">
              <IconEye />
              Publishers
            </SidebarLink>
          </SidebarSection>
          {/* End Section Main */}

          {/* Section: Base Models */}
          <SidebarSection caption="Base Models">
            {/* Group: Actors */}
            <SidebarGroup
              id="base-actors"
              caption="Actors"
              icon={<IconUsers />}
            >
              <SidebarLink to="#" nested>
                Skin Colors
              </SidebarLink>
            </SidebarGroup>

            {/* Group: General */}
            <SidebarGroup
              id="base-general"
              caption="General"
              icon={<IconEye />}
            >
              <SidebarLink to="/admin/countries" nested>
                Countries
              </SidebarLink>

              <SidebarLink to="/admin/languages" nested>
                Languages
              </SidebarLink>

              <SidebarLink to="/admin/regions" nested>
                Regions
              </SidebarLink>
            </SidebarGroup>
          </SidebarSection>
          {/* End Section Base Models */}

          {/* Section: Admin */}
          <SidebarSection caption="Admin" requireRole={Roles.ADMIN}>
            <SidebarLink to="/admin/security/permissions">
              <IconEye className="mt-0.5 size-4 shrink-0" />
              Permissions
            </SidebarLink>

            <SidebarLink to="/admin/security/roles">
              <IconEye className="mt-0.5 size-4 shrink-0" />
              Roles
            </SidebarLink>

            <SidebarLink to="/admin/system">
              <IconEye className="mt-0.5 size-4 shrink-0" />
              System
            </SidebarLink>
          </SidebarSection>
          {/* End Section Admin */}
        </div>
        {/* End Content Container */}

        <SidebarFooter />

        <div className="absolute -end-3 top-3 z-10 lg:hidden">
          {/* Sidebar Close */}
          <button
            type="button"
            className={cn(
              "inline-flex h-7 w-6 items-center justify-center gap-x-2 rounded-md border ",
              "focus:outline-none disabled:pointer-events-none disabled:opacity-50",
              "border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:bg-gray-100",
              "dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
            )}
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          {/* End Sidebar Close */}
        </div>
      </div>
    </aside>
  );
}
