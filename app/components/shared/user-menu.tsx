import { Link, useSubmit } from "@remix-run/react";
import { Menu, MenuDivider, MenuItem } from "@szhsin/react-menu";

import { IconCog } from "#app/components/icons/icon-cog";
import { IconFolder } from "#app/components/icons/icon-folder";
import { IconHeart } from "#app/components/icons/icon-heart";
import { IconLogout } from "#app/components/icons/icon-logout";
import { IconUser } from "#app/components/icons/icon-user";
import { Button } from "#app/components/shared/button";
import { AUTH_LOGIN_ROUTE, AUTH_LOGOUT_ROUTE } from "#app/utils/constants";
import { useOptionalUser, userHasRole } from "#app/utils/user";
import { Roles } from "#app/validations/role-schema";

export const UserMenu = () => {
  const user = useOptionalUser();

  const submit = useSubmit();

  // css for menu in frontend.css
  const menuItemClass =
    "text-sm rounded-lg text-gray-800 dark:text-neutral-300 hover:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 whitespace-nowrap";
  const dividerClass = "border-t border-gray-200 dark:border-neutral-800";
  const iconClass = "inline-block size-4 mr-2";

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
      {user && (
        <Menu
          menuButton={
            <button
              type="button"
              className="inline-flex size-[38px] items-center justify-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              title={user.email}
            >
              <IconUser />
            </button>
          }
          position="anchor"
          transition
        >
          <Link
            to="/"
            className="text-sm text-gray-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300"
          >
            <MenuItem className={menuItemClass}>
              <IconHeart className={iconClass} />
              My Likes
            </MenuItem>
          </Link>

          <Link
            to="/"
            className="text-sm text-gray-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300"
          >
            <MenuItem className={menuItemClass}>
              <IconFolder className={iconClass} />
              My Collection
            </MenuItem>
          </Link>

          <Link
            to="/user/settings"
            className="text-sm text-gray-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300"
          >
            <MenuItem className={menuItemClass}>
              <IconCog className={iconClass} />
              Settings
            </MenuItem>
          </Link>

          {/* Link to Admin Dashboard */}
          {userHasRole(user, [Roles.ADMIN, Roles.MODERATOR]) && (
            <>
              <MenuDivider className={dividerClass} />

              <Link
                to="/admin"
                className="text-sm text-gray-800 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-neutral-300"
              >
                <MenuItem className={menuItemClass}>
                  <IconCog className={iconClass} />
                  Admin
                </MenuItem>
              </Link>
            </>
          )}

          <MenuDivider className={dividerClass} />

          <MenuItem
            className={menuItemClass}
            onClick={() =>
              submit(null, {
                method: "post",
                action: AUTH_LOGOUT_ROUTE
              })
            }
          >
            <IconLogout className={iconClass} />
            Sign Out
          </MenuItem>
        </Menu>
      )}
    </>
  );
};
