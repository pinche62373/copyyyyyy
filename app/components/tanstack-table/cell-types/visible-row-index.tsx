import { type Row, type Table } from "@tanstack/react-table";

// counter for visible rows
// -----------------------------------------------------
/* eslint-disable  @typescript-eslint/no-explicit-any */
// -----------------------------------------------------
export const getCellTypeVisibleRowIndex = (row: Row<any>, table: Table<any>) => {
  return (
    (table
      .getSortedRowModel()
      ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1
  );
};
