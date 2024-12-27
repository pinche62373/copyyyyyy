import { createContext } from "react";

import { t_table } from "#types/table";

export const TableContext = createContext<{
  // biome-ignore lint/suspicious/noExplicitAny: Known Tanstack issue
  table?: t_table<any>;
}>({
  table: undefined,
});
