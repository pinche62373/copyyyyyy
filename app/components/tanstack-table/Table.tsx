import type { PropsWithChildren } from "react";
import { TableContext } from "#app/components/tanstack-table/Context";
import { cn } from "#app/utils/lib/cn.ts";
import type { t_table } from "#types/table.js";

interface IProps<T> {
  table: t_table<T>;
  className?: string;
}

export const TableFC = <T,>({
  children,
  table,
  className,
}: PropsWithChildren<IProps<T>>) => {
  return (
    <TableContext.Provider value={{ table: table }}>
      <div className={cn("relative overflow-x-auto", className)}>
        <div className="">
          {/* Table */}
          <div className="w-full overflow-auto">
            <table className="min-w-full">{children}</table>
          </div>
        </div>
        {/* End Table */}
      </div>
    </TableContext.Provider>
  );
};
