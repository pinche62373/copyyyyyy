// TODO
// - Singular model name for add button

interface PropTypes {
  model: string;
  search?: boolean;
}

export function AdminPageTitleList({ model, search = false }: PropTypes) {
  return (
    <>
      {/* Header */}
      <div className="pb-2 grid sm:flex sm:justify-between sm:items-center gap-2">
        <h2 className="inline-block font-semibold text-gray-800 dark:text-neutral-200">
          {model}
        </h2>

        {/* Conditional Search */}
        {search && (
          <>
            {/* Form Group */}
            <div className="flex sm:justify-end items-center gap-x-2">
              {/* Search Input  */}
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3">
                  <svg
                    className="flex-shrink-0 size-4 text-gray-500 dark:text-neutral-400"
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
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="py-1.5 px-3 ps-8 w-40 sm:w-full block bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600"
                  placeholder="Search"
                />
              </div>
              {/* End Search Input  */}

              {/* Button  */}
              <button
                type="button"
                className="p-2 inline-flex items-center gap-x-1.5 text-xs font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg
                  className="hidden sm:block flex-shrink-0 size-4"
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
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add Model
              </button>
              {/* End Button */}
            </div>
            {/* End Form Group  */}
          </>
        )}
        {/* End Conditional Search */}
      </div>
      {/* End Header  */}
    </>
  );
}
