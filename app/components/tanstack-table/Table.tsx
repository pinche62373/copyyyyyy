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
  const totalRecords = table.getRowCount()

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

        {/* Footer */}
        <div className="mt-5 flex flex-wrap justify-between items-center gap-2 pl-2">
          {/* Record Counter */}
          <p className="text-sm text-stone-800 dark:text-neutral-200">
            <span className="font-medium">n</span>
            <span className="text-stone-500 dark:text-neutral-500 pl-1">
              records of 
            </span>
            <span className="font-medium pl-1">{totalRecords}</span>
          </p>

          {/* Pagination */}
          <nav className="flex justify-end items-center gap-x-1">
            <button
              type="button"
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-stone-800 hover:bg-stone-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-neutral-700"
              disabled={!table.getCanPreviousPage()}
            >
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
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span aria-hidden="true" className="sr-only">
                Previous
              </span>
            </button>
            <div className="flex items-center gap-x-1">
              <span className="min-h-[38px] min-w-[38px] flex justify-center items-center bg-stone-100 text-stone-800 py-2 px-3 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:text-white">
                {currentPage}
              </span>
              <span className="min-h-[38px] flex justify-center items-center text-stone-500 py-2 px-1.5 text-sm dark:text-neutral-500">
                of
              </span>
              <span className="min-h-[38px] flex justify-center items-center text-stone-500 py-2 px-1.5 text-sm dark:text-neutral-500">
              {totalPage}
              </span>
            </div>
            <button
              type="button"
              className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-stone-800 hover:bg-stone-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-neutral-700"
              disabled={!table.getCanNextPage()}
            >
              <span aria-hidden="true" className="sr-only">
                Next
              </span>
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </nav>
          {/* End Pagination*/}
        </div>
        {/* End Footer */}


      </div>
    </TableContext.Provider>
  );
};

export default TableFC;
