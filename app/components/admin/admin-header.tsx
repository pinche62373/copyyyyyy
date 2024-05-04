import { Form } from "@remix-run/react";

import { IconCog } from "#app/components/icons/icon-cog";
import { IconFolder } from "#app/components/icons/icon-folder";
import { IconHeart } from "#app/components/icons/icon-heart";
import { IconLogout } from "#app/components/icons/icon-logout";
import { IconUser } from "#app/components/icons/icon-user";
import { AUTH_LOGOUT_ROUTE } from "#app/utils/constants";

export const AdminHeader = () => {
  return (
    <header className="lg:ms-[260px] fixed top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
      {/* Global Div */}
      <div
        className="flex justify-between xl:grid xl:grid-cols-3 basis-full items-center w-full py-2.5 px-2 sm:px-5"
        aria-label="Global"
      >
        {/* Menu Left */}
        <div className="xl:col-span-1 flex items-center md:gap-x-3">
          <div className="lg:hidden">
            {/* Sidebar Toggle */}
            <button
              type="button"
              className="w-7 h-[38px] inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            {/* End Sidebar Toggle */}
          </div>
        </div>

        {/* Menu Right */}
        <div className="xl:col-span-2 flex justify-end items-center gap-x-2">
          <div className="flex items-center">
            <div className="h-[38px]">
              {/* Account Dropdown */}
              <div className="hs-dropdown relative inline-flex   [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right]">
                <button
                  id="@@id"
                  type="button"
                  className="mt-1 inline-flex flex-shrink-0 items-center gap-x-3 text-start rounded-lg focus:outline-none focus:bg-gray-100 dark:focus:bg-neutral-700 text-gray-800"
                >
                  <IconUser
                    className="mr-0 pl-2 pr-2 flex-shrink-0 size-[38px] rounded-lg hover:bg-gray-100"
                    strokeWidth={2}
                  />
                </button>

                {/* Account Dropdown Items */}
                <div
                  className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] dark:bg-neutral-900 dark:shadow-[0_10px_40px_10px_rgba(0,0,0,0.2)]"
                  aria-labelledby="@@id"
                >
                  {/* Account Dropdown Items Group 1 */}
                  <div className="p-1">
                    {/* My Likes */}
                    <a
                      className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      href="/"
                    >
                      <IconHeart />
                      My Likes
                    </a>

                    {/* My Collection */}
                    <a
                      className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      href="/"
                    >
                      <IconFolder />
                      My Collection
                    </a>

                    {/* Settings */}
                    <a
                      className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                      href="/"
                    >
                      <IconCog />
                      Settings
                    </a>
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
                        <IconLogout width="19" height="19" />
                        Sign Out
                      </button>
                    </Form>
                  </div>
                  {/* End Account Dropdown Items Group 2 */}
                </div>
                {/* End Account Dropdown Items */}
              </div>
              {/* End Account Dropdown */}
            </div>
          </div>
        </div>
        {/* End Menu Right */}
      </div>
      {/* End Global Div */}
    </header>
  );
};
