import { flexRender } from "@tanstack/react-table";

import useTable from "#app/components/tanstack-table/useTable";
import { cn } from "#app/utils/lib/cn";

const THead = () => {
  const table = useTable();

  if (!table) return null;
  return (
    <thead>
      <tr>
        {table.getHeaderGroups().map((x) => {
          return x.headers.map((header) => {
            return (
              <th
                key={header.id}
                scope="col"
                className={cn(
                  "p-0",
                  header.column.columnDef.meta?.headerProps?.className,
                )}
              >
                {header.isPlaceholder ? null : (
                  <div className="flex">
                    <div className="relative inline-flex w-full">
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-x-1 px-5 py-2.5 text-start text-sm font-normal focus:outline-none",
                          "text-sm font-bold text-secondary-foreground",
                          "bg-gray-100 focus:bg-gray-100",
                          "dark:bg-[#1a2941]  dark:focus:bg-[#1a2941]",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                        {/* Conditional Sort Icon */}
                        {header.column.getCanSort() && (
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
