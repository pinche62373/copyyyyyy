import { PropsWithChildren } from "react";

import { t_table } from "#app/components/tanstack-table/types";
import { cn } from "#app/utils/lib/cn";

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
        "flex flex-wrap items-center justify-between gap-2 pt-5",
        className
      )}
      {...rest}
    >
      {/* Page Size */}
      <span data-hs-input-number="">
        <div className="inline-flex items-center gap-x-1">
          <p className="text-sm text-secondary-foreground">Results per page:</p>
          {/* Counter */}
          <input
            aria-label="Page Size"
            id="table-footer-page-size-input"
            type="number"
            min="1"
            className={cn(
              "no-spin-button w-11 rounded-lg p-2 text-center", // focus:outline-none focus:ring-0",
              "border border-border bg-input",              
              "focus:border-ring focus:ring-0",
              "text-sm font-medium text-secondary-foreground",
            )}
            defaultValue={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          />
          {/* End Counter */}
          <div className="flex items-center gap-x-1.5">
            <span className="text-sm text-secondary-foreground">of</span>
            <span className="text-sm font-medium text-secondary-foreground">
              {totalRecordCount}
            </span>
          </div>
        </div>
      </span>
      {/* End Page Size */}

      {/* Page Navigation */}
      <nav className="flex items-center justify-end gap-x-1">
        <button
          type="button"
          aria-label="Previous Page"
          className={cn(
            "inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-2 rounded-lg px-2.5 py-2",
            "focus:outline-none disabled:pointer-events-none disabled:opacity-50",
            "text-sm text-secondary-foreground hover:bg-input"
          )}
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
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
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span aria-hidden="true" className="sr-only">
            Previous
          </span>
        </button>
        <div className="flex items-center gap-x-1">
          <span
            className={cn(
              "flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg px-3 py-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "bg-foreground text-sm font-medium text-secondary-foreground"
            )}
          >
            {currentPageIndex}
          </span>
          <span className="flex min-h-[38px] items-center justify-center px-1.5 py-2 text-sm text-secondary-foreground">
            of
          </span>
          <span className="flex min-h-[38px] items-center justify-center px-1.5 py-2 text-sm text-secondary-foreground">
            {totalPageCount}
          </span>
        </div>
        <button
          type="button"
          aria-label="Previous Page"
          className={cn(
            "inline-flex min-h-[38px] min-w-[38px] items-center justify-center gap-x-2 rounded-lg px-2.5 py-2",
            "focus:outline-none disabled:pointer-events-none disabled:opacity-50",
            "text-sm text-secondary-foreground hover:bg-input"
          )}
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          <span aria-hidden="true" className="sr-only">
            Next
          </span>
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
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </nav>
      {/* End Page Navigation */}
    </div>
  );
};
