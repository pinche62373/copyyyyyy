// TODO count children so we can render correct number

export const TableFilterDropdown = () => {
  return (
    <div className="flex items-center justify-end gap-x-2 pr-3">
      {/* Filter Options */}
      <div className="hs-dropdown relative inline-flex [--auto-close:inside]">
        {/* Filter Dropdown */}
        <button
          id="hs-pro-dptfd"
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
        >
          <svg
            className="size-3.5 shrink-0"
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
            <line x1="21" x2="14" y1="4" y2="4"></line>
            <line x1="10" x2="3" y1="4" y2="4"></line>
            <line x1="21" x2="12" y1="12" y2="12"></line>
            <line x1="8" x2="3" y1="12" y2="12"></line>
            <line x1="21" x2="16" y1="20" y2="20"></line>
            <line x1="12" x2="3" y1="20" y2="20"></line>
            <line x1="14" x2="14" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="10" y2="14"></line>
            <line x1="16" x2="16" y1="18" y2="22"></line>
          </svg>
          Filters
          {/* TODO show counter if filters are active */}
          {/* <span className="font-medium text-[10px] py-0.5 px-[5px] bg-gray-800 text-white leading-3 rounded-full dark:bg-neutral-500">
            5
          </span> */}
        </button>
        {/* Filter Dropdown */}

        {/* Filter Dropdown Items */}
        <div
          className="duration hs-dropdown-menu z-10 hidden w-48 rounded-xl bg-white opacity-0 shadow-[0_10px_40px_10px_rgba(0,0,0,0.08)] transition-[opacity,margin] hs-dropdown-open:opacity-100 dark:bg-neutral-900 dark:shadow-[0_10px_40px_10px_rgba(0,0,0,0.2)]"
          aria-labelledby="hs-pro-dptfd"
        >
          {/* Dropdown Items Container */}
          <div className="p-1">
            {/* Model Filter */}
            <div className="flex cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800">
              <input
                type="checkbox"
                className="size-3.5 shrink-0 rounded border-gray-200 text-blue-600 focus:ring-offset-0 dark:border-neutral-700 dark:bg-neutral-800"
                id="hs-pro-dupfindch1"
              />
              <label
                htmlFor="hs-pro-dupfindch1"
                className="flex flex-1 cursor-pointer items-center gap-x-3 text-sm text-gray-800 dark:text-neutral-300"
              >
                Model Permissions
              </label>
            </div>
            {/* End Model Filter */}

            {/* Route Filter */}
            <div className="flex cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800">
              <input
                type="checkbox"
                className="size-3.5 shrink-0 rounded border-gray-200 text-blue-600 focus:ring-offset-0 dark:border-neutral-700 dark:bg-neutral-800"
                id="hs-pro-dupfindch2"
              />
              <label
                htmlFor="hs-pro-dupfindch2"
                className="flex flex-1 cursor-pointer items-center gap-x-3 text-sm text-gray-800 dark:text-neutral-300"
              >
                Route Permissions
              </label>
            </div>
            {/* End Route Filter */}
          </div>
          {/* End Dropdown Items Container */}
        </div>
        {/* End Filter Dropdown Items */}
      </div>
      {/*End Filter Dropdown */}
    </div>
  );
};
