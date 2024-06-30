import { NavLink } from "@remix-run/react";

import { SidebarFooter } from "#app/components/admin/sidebar/sidebar-footer";
import { SidebarGroup } from "#app/components/admin/sidebar/sidebar-group";
import { SidebarLink } from "#app/components/admin/sidebar/sidebar-link";
import { SidebarSection } from "#app/components/admin/sidebar/sidebar-section";
import { IconDog } from "#app/components/icons/icon-dog";
import { IconEye } from "#app/components/icons/icon-eye";
import { IconHome } from "#app/components/icons/icon-home";
import { IconMovie } from "#app/components/icons/icon-movie";
import { IconUsers } from "#app/components/icons/icon-users";
import { Roles } from "#app/validations/role-schema";

export function AdminSidebar() {
  return (
    <aside
      id="hs-pro-sidebar"
      className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-[260px] hidden fixed inset-y-0 start-0 z-[60] bg-white border-e border-gray-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 dark:bg-neutral-800 dark:border-neutral-700"
    >
      <div className="flex flex-col h-full max-h-full py-3">
        <header className="h-[46px] px-8">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
            aria-label="Preline"
          >
            Logo
          </NavLink>
          {/* End Logo */}
        </header>

        {/* Content Container */}
        <div className="h-[calc(100%-35px)] lg:h-[calc(100%-93px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
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

            {/* Group: Animals */}
            <SidebarGroup id="animals" caption="Animals" icon={<IconDog />}>
              <SidebarLink to="#" nested>
                Overview
              </SidebarLink>

              <SidebarLink to="#" nested>
                Add Animal
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
            <SidebarGroup id="base-general" caption="General" icon={<IconEye />}>
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
          <SidebarSection caption="Admin" require={Roles.ADMIN}>
            <SidebarLink to="/admin/rbac/permissions">
              <IconEye className="flex-shrink-0 mt-0.5 size-4" />
              Permissions
            </SidebarLink>

            <SidebarLink to="/admin/rbac/roles">
              <IconEye className="flex-shrink-0 mt-0.5 size-4" />
              Roles
            </SidebarLink>

            <SidebarLink to="/admin/system">
              <IconEye className="flex-shrink-0 mt-0.5 size-4" />
              System
            </SidebarLink>
          </SidebarSection>
          {/* End Section Admin */}
        </div>
        {/* End Content Container */}

        <SidebarFooter />

        <div className="lg:hidden absolute top-3 -end-3 z-10">
          {/* Sidebar Close */}
          <button
            type="button"
            className="w-6 h-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          {/* End Sidebar Close */}
        </div>
      </div>
    </aside>
  );
}
