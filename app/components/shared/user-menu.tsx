import { Form, Link } from "@remix-run/react";
import { useHydrated } from "remix-utils/use-hydrated";

import { IconCog } from "#app/components/icons/icon-cog";
import { IconFolder } from "#app/components/icons/icon-folder";
import { IconHeart } from "#app/components/icons/icon-heart";
import { IconLogout } from "#app/components/icons/icon-logout";
import { IconUser } from "#app/components/icons/icon-user";
import { Button } from "#app/components/shared/button";
import { AUTH_LOGIN_ROUTE, AUTH_LOGOUT_ROUTE } from "#app/utils/constants";
import { cn } from "#app/utils/misc";
import { useOptionalUser, userHasRole } from "#app/utils/user";
import { Roles } from "#app/validations/role-schema";

interface Props {
  className?: string;
}

export const UserMenu = ({ className }: Props) => {
  const isHydrated = useHydrated();

  const user = useOptionalUser();

  return (
    <>
      {/* UNAUTHENTICATED USER */}
      {!user && (
        <div className="relative inline-flex">
          <Button
            text="Sign In"
            type="button"
            to={AUTH_LOGIN_ROUTE}
            secondary
            className="ml-2"
          />
        </div>
      )}

      {/* AUTHENTICATED USER */}
      {user && isHydrated ? (
        <div
          className={cn(
            "hs-dropdown relative inline-flex [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right]",
            className,
          )}
        >
          <button
            id="@@id"
            type="button"
            className="size-[38px] inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            title={user.email}
          >
            <IconUser />
          </button>

          {/* Account Dropdown Items */}
          <div
            className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] dark:bg-neutral-900 dark:shadow-[0_10px_40px_10px_rgba(0,0,0,0.2)]"
            aria-labelledby="@@id"
          >
            {/* Account Dropdown Items Group 1 */}
            <div className="p-1">
              {/* My Likes */}
              <Link
                to="/"
                className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                <IconHeart />
                My Likes
              </Link>

              {/* My Collection */}
              <Link
                to="/"
                className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                <IconFolder />
                My Collection
              </Link>

              {/* Admin Dashboard */}
              {userHasRole(user, [Roles.ADMIN, Roles.MODERATOR]) && (
                <Link
                  to="/admin"
                  className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  <IconCog />
                  Admin
                </Link>
              )}

              {/* Settings */}
              <Link
                to="/user/settings"
                className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                <IconCog />
                Settings
              </Link>
            </div>
            {/* End Account Dropdown Items Group 1 */}

            {/* Account Dropdown Items Group 2 */}
            <div className="p-1 border-t border-gray-200 dark:border-neutral-800">
              <Form action={AUTH_LOGOUT_ROUTE} method="post">
                <button
                  type="submit"
                  className="flex mt-0.5 gap-x-3 py-2 px-3 w-full rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  data-hs-overlay="#hs-pro-dasadam"
                >
                  <IconLogout />
                  Sign Out
                </button>
              </Form>
            </div>
            {/* End Account Dropdown Items Group 2 */}
          </div>
          {/* End Account Dropdown Items */}
        </div>
      ) : null}
    </>
  );
};
