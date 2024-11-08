import { PropsWithChildren } from "react";

import { TableContext } from "#app/components/tanstack-table/Context";
import { t_table } from "#app/components/tanstack-table/types";

interface IProps<T> {
  table: t_table<T>;
}

export const TableFC = <T,>({ children, table }: PropsWithChildren<IProps<T>>) => {
  return (
    <TableContext.Provider value={{ table: table }}>
      <div className="relative overflow-x-auto">
        <div className="px-3">
          {/* Table */}
          <div className="w-full overflow-auto">
            <table className="min-w-full">
              {children}
            </table>
          </div>
        </div>
        {/* End Table */}
      </div>
    </TableContext.Provider>
  );
};
