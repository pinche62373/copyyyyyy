import { Table, flexRender } from "@tanstack/react-table";
import useTable from "./useTable";

interface IProps<T> {
  isSortable?: boolean;
}

const THead = <T,>({ isSortable }: IProps<T>) => {
  const table = useTable();

  if (!table) return null;
  return (
    <thead className="bg-gray-70 dark:bg-neutral-700">
      <tr>
        {table.getHeaderGroups().map((x) => {
          return x.headers.map((header) => {
            return (
              <th key={header.id} scope="col" className={"min-w-[20px]" + (header.column.getCanSort() ? "" : "cursor-default !important")}>
                {header.isPlaceholder ? null : (
                  <div className="flex">
                    <div className="hs-dropdown relative inline-flex w-full">
                      <span
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        <button
                          id="hs-pro-ptpn"
                          type="button"
                          className="px-5 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-500 dark:focus:bg-neutral-700"
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
                      </span>
                    </div>

                    {/* {{
                        asc: <i className="fa-solid fa-sort-up ml-1"></i>,
                        desc: <i className="fa-solid fa-sort-down ml-1"></i>,
                      }[header.column.getIsSorted() as string] ?? null} */}
                    {/* </div> */}
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
