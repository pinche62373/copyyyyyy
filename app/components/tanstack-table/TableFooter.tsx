import { PropsWithChildren } from "react";

import { cn } from "#app/utils/misc";

import { t_table } from "./types";

interface IProps<T> {
  table: t_table<T>;
  className?: string;
}

export const TableFooter = <T,>({
  table,
  className,
  ...rest
}: PropsWithChildren<IProps<T>>) => {
  const currentPageIndex = table.getState().pagination.pageIndex + 1;
  const totalPageCount = table.getPageCount();
  const totalRecordCount = table.getRowCount();

  return (
    <div
      className={cn(
        "mt-4 flex flex-wrap justify-between items-center gap-2 pl-2",
        className,        
      )}
      {...rest}
    >
      {/* Page Size */}
      <span data-hs-input-number="">
        <div className="inline-flex items-center gap-x-1">
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Results per page:
          </p>
          {/* Counter */}
          <input
            type="number"
            min="1"
            className="no-spin-button p-2 w-11 text-sm font-medium focus:outline-none  focus:bg-stone-100 bg-white border border-gray-200 rounded-lg text-center focus:ring-0 text-stone-800 dark:text-neutral-200 dark:bg-neutral-700 dark:focus:bg-neutral-700 dark:border-neutral-700"
            defaultValue={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          />
          {/* End Counter */}
          <div className="flex items-center gap-x-1.5">
            <span className="text-sm text-gray-600 dark:text-neutral-400">
              of
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-neutral-400">{totalRecordCount}</span>
          </div>
        </div>
      </span>
      {/* End Page Size */}

      {/* Page Navigation */}
      <nav className="flex justify-end items-center gap-x-1">
        <button
          type="button"
          className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-stone-800 hover:bg-stone-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-neutral-700"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
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
          <span className="min-h-[38px] min-w-[38px] flex justify-center items-center bg-stone-100  py-2 px-3 text-sm font-medium rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 text-stone-800 dark:text-neutral-200">
            {currentPageIndex}
          </span>
          <span className="min-h-[38px] flex justify-center items-center text-stone-500 py-2 px-1.5 text-sm dark:text-neutral-500">
            of
          </span>
          <span className="min-h-[38px] flex justify-center items-center text-stone-500 py-2 px-1.5 text-sm dark:text-neutral-500">
            {totalPageCount}
          </span>
        </div>
        <button
          type="button"
          className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-stone-800 hover:bg-stone-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-100 dark:text-white dark:hover:bg-white/10 dark:focus:bg-neutral-700"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
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
      {/* End Page Navigation */}
    </div>
  );
};

export default TableFooter;
