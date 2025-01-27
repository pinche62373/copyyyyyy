import type { RowData, Table } from "@tanstack/react-table";

export type t_table<T> = Table<T>;

declare module "@tanstack/table-core" {
  // biome-ignore lint/correctness/noUnusedVariables: Known Tanstack issue
  interface ColumnMeta<TData extends RowData, TValue> {
    headerProps?: {
      className: string;
    };
    cellProps?: {
      className: string;
    };
  }
}
