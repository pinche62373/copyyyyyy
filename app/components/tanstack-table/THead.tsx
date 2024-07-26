import { flexRender } from "@tanstack/react-table";

import useTable from "./useTable";

const THead = () => {
  const table = useTable();

  if (!table) return null;
  return (
    <thead className="border-t">
      <tr className="divide-x divide-gray-200 dark:divide-neutral-700">
        {table.getHeaderGroups().map((x) => {
          return x.headers.map((header) => {
            return (
              <th
                key={header.id}
                scope="col"
                className={header.column.columnDef.meta?.className}
              >
                {header.isPlaceholder ? null : (
                  <div className="flex">
                    <div className="relative inline-flex w-full">
                      <button
                        type="button"
                        className="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal focus:outline-none focus:bg-gray-100 dark:focus:bg-neutral-700   "
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                        {/* Conditional Sort Icon */}
                        {header.column.getCanSort() && (
                          <svg
                            className="flex-shrink-0 size-3.5"
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
                            <path d="m7 15 5 5 5-5" />
                            <path d="m7 9 5-5 5 5" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </th>
            );
          });
        })}
      </tr>
    </thead>
  );
};

export default THead;
