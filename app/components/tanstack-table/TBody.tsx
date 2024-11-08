import { flexRender } from "@tanstack/react-table";

import useTable from "#app/components/tanstack-table/useTable";
import { cn } from "#app/utils/lib/cn";

const TBody = () => {
  const table = useTable();

  if (!table) return null;
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className="border-b border-sidebar-border hover:bg-sidebar-hover"
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className={cn(
                "size-px whitespace-nowrap px-5 py-1",
                cell.column.columnDef.meta?.cellProps?.className,
              )}
            >
              <span className="text-sm text-sidebar-primary">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TBody;
