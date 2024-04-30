import { NavLink } from "@remix-run/react";
import { CellContext } from "@tanstack/react-table";

// -----------------------------------------------------
// TODO: fix <any> type check
// -----------------------------------------------------
/* eslint-disable  @typescript-eslint/no-explicit-any */
// -----------------------------------------------------
export const getCellLinkToSelf = (info: CellContext<any, string>) => {
  return (
    <NavLink
      to={info.row.original.id}
      className="block text-sm font-medium text-gray-800 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 dark:text-white dark:hover:text-white/70 dark:focus:text-white/70"
    >
      {info.getValue()}
    </NavLink>
  );
};
