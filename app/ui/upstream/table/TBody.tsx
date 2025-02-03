import { flexRender } from "@tanstack/react-table";

import useTable from "#app/ui/upstream/table/useTable";
import { cn } from "#app/utils/lib/cn";

const TBody = () => {
  const table = useTable();

  if (!table) return null;
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className="h-[46.5px] border-b border-border hover:bg-input"
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className={cn(
                "size-px whitespace-nowrap px-5 py-1",
                cell.column.columnDef.meta?.cellProps?.className,
              )}
            >
              <span className="text-secondary-foreground">
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
