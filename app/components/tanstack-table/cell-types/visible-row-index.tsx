import { type Row, type Table } from "@tanstack/react-table";

interface PropTypes {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Row<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>;
}

export const tableCellVisibleRowIndex = ({ row, table }: PropTypes) => {
  return (
    (table
      .getSortedRowModel()
      ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1
  );
};
