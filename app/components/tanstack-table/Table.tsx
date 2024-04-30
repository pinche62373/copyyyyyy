import { PropsWithChildren } from "react";

import { TableContext } from "./Context";
import { t_table } from "./types";

interface IProps<T> {
  table: t_table<T>;
}

const TableFC = <T,>({ children, table }: PropsWithChildren<IProps<T>>) => {
  return (
    <TableContext.Provider value={{ table: table }}>
      <div className="relative overflow-x-auto">
        <div className="px-3">
          {/* Table */}
          <div className="w-full overflow-auto">
            <table className="min-w-full divide-y divide-gray-200  dark:divide-neutral-700">
              {children}
            </table>
          </div>
        </div>
        {/* End Table */}
      </div>
    </TableContext.Provider>
  );
};

export default TableFC;
