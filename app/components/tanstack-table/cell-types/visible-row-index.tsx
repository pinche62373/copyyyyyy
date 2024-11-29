import { type Row, type Table } from "@tanstack/react-table";

interface PropTypes {
  // biome-ignore lint/suspicious/noExplicitAny: Known Tanstack issue
  row: Row<any>;
  // biome-ignore lint/suspicious/noExplicitAny: Known Tanstack issue
  table: Table<any>;
}

export const tableCellVisibleRowIndex = ({ row, table }: PropTypes) => {
  return (
    (table
      .getSortedRowModel()
      ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1
  );
};
