import { Table, RowData } from "@tanstack/react-table";

export type t_table<T> = Table<T>;

declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}
