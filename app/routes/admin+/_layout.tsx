import { Outlet } from "@remix-run/react";

import { AdminSidebar } from "~/components/admin/sidebar";

export default function AdminLayout() {
  return (
    <>
      {/* ========== HEADER ========== */}
      <header className="lg:hidden lg:ms-[260px] fixed top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
        <div
          className="flex justify-between basis-full items-center w-full py-2.5 px-2 sm:px-5"
          aria-label="Global"
        >
          {/* Sidebar Toggle  */}
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
          {/* End Sidebar Toggle  */}
        </div>
      </header>
      {/* ========== END HEADER ========== */}

      <AdminSidebar />

      {/* ========== MAIN CONTENT ========== */}
      <main id="content" className="lg:ps-[260px] pt-[59px] lg:pt-0">
        <div className="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
          {/* Card */}
          <div className="p-4 flex flex-col justify-center h-72 md:h-96 min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-40px)] bg-white shadow-sm rounded-xl dark:bg-neutral-800">
            <div className="relative h-full overflow-hidden">
              <div className="absolute inset-0 size-full">
                <Outlet />
              </div>
            </div>
          </div>
          {/* End Card */}
        </div>
      </main>
      {/* ========== END MAIN CONTENT ========== */}
    </>
  );
}
