import { PropsWithChildren } from "react";

import { TableContext } from "./Context";
import { t_table } from "./types";

interface IProps<T> {
  table: t_table<T>;
}

const TableFC = <T,>({ children, table }: PropsWithChildren<IProps<T>>) => {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPage = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;

  const selectedPageClass =
    "flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white";
  const unstatePageClass =
    "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";

  return (
    <TableContext.Provider value={{ table: table }}>
      <div className="relative overflow-x-auto">
        <div className="border border-gray-200 rounded-lg">
          {/* Table */}
          <table className="min-w-full divide-y divide-gray-200  dark:divide-neutral-700">
            {children}
          </table>
        </div>
        {/* End Table */}

        {/* Page Index */}
        <nav
          className="flex items-center justify-between pt-4 p-2 pr-0"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Page{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalPage}{" "}
            </span>
            - Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {pageSize}
            </span>
          </span>
          {/* End Page Index */}

          {/* Page Navigation */}
          <ul className="inline-flex -space-x-px text-sm h-8">
            {/* Previous Page */}
            <li>
              <a
                href="#"
                onClick={() =>
                  table.getCanPreviousPage() && table.previousPage()
                }
                className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Previous
              </a>
            </li>
            {/* End Previous Page */}

            {/* Page Numbers */}
            {Array.from({ length: totalPage }, (_, i) => i + 1).map((x) => {
              return (
                <li key={x}>
                  <a
                    href={`#page-${x}`}
                    className={
                      x === currentPage ? selectedPageClass : unstatePageClass
                    }
                    onClick={() => table.setPageIndex(x - 1)}
                  >
                    {x}
                  </a>
                </li>
              );
            })}
            {/* End Page Numbers */}

            {/* Next Page */}
            <li>
              <a
                href="#"
                onClick={() => table.getCanNextPage() && table.nextPage()}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
              </a>
            </li>
            {/* End Next Page */}
          </ul>
        </nav>
        {/* End Page Navigation */}
      </div>
    </TableContext.Provider>
  );
};

export default TableFC;
