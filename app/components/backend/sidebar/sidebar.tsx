import type React from "react";
import { NavLink } from "react-router";
import { SidebarFooter } from "#app/components/backend/sidebar/sidebar-footer";
import { SidebarGroup } from "#app/components/backend/sidebar/sidebar-group";
import { SidebarLink } from "#app/components/backend/sidebar/sidebar-link";
import { SidebarSection } from "#app/components/backend/sidebar/sidebar-section";
import { Icon } from "#app/ui/upstream/icon.tsx";
import { cn } from "#app/utils/lib/cn";
import { Roles } from "#app/validations/role-schema";

interface Props {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function BackendSidebar({ className, onClick }: Props) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 start-0 z-[60] w-[260px]",
        "transition-all duration-300 [--auto-close:lg]",
        "lg:bottom-0 lg:end-auto lg:block lg:translate-x-0",
        "border-e border-border bg-foreground",
        "invisible lg:visible",
        className,
      )}
    >
      <div className="flex h-full max-h-full flex-col py-3">
        <header className="h-[46px] px-8">
          {/* Logo */}
          <NavLink
            to="/"
            className="inline-block flex-none rounded-md text-xl font-semibold text-sidebar-primary focus:opacity-80 focus:outline-none"
            aria-label="Home"
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
              <Icon name="home" />
              Dashboard
            </SidebarLink>

            {/* Group: Actors */}
            <SidebarGroup
              id="actors"
              caption="Actors"
              icon={<Icon name="users" />}
            >
              <SidebarLink to="#" nested>
                Overview
              </SidebarLink>
            </SidebarGroup>

            {/* Group: Movies */}
            <SidebarGroup
              id="movies"
              caption="Movies"
              icon={<Icon name="video" />}
            >
              <SidebarLink to="#" nested>
                Overview
              </SidebarLink>
            </SidebarGroup>
          </SidebarSection>
          {/* End Section Main */}

          {/* Section: Base Models */}
          <SidebarSection caption="Base Models">
            {/* Group: Actors */}
            <SidebarGroup
              id="base-actors"
              caption="Actors"
              icon={<Icon name="users" />}
            >
              <SidebarLink to="#" nested>
                Skin Colors
              </SidebarLink>
            </SidebarGroup>

            {/* Group: General */}
            <SidebarGroup
              id="base-general"
              caption="General"
              icon={<Icon name="eye" />}
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
              <Icon name="eye" className="mt-0.5 size-4 shrink-0" />
              Permissions
            </SidebarLink>

            <SidebarLink to="/admin/security/roles">
              <Icon name="eye" className="mt-0.5 size-4 shrink-0" />
              Roles
            </SidebarLink>

            <SidebarLink to="/admin/system">
              <Icon name="eye" className="mt-0.5 size-4 shrink-0" />
              System
            </SidebarLink>
          </SidebarSection>
          {/* End Section Admin */}
        </div>
        {/* End Content Container */}

        <SidebarFooter />

        {/* Mobile - Close Drawer Button */}
        <div className="lg:hidden absolute -end-3 top-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              if (onClick) onClick(e);
            }}
            className={cn(
              "inline-flex h-8 w-8 p-3 items-center justify-center gap-x-2 rounded-md border",
              "text-sm font-medium",
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </div>
        {/* End Mobile - Close Drawer Button */}
      </div>
    </aside>
  );
}
