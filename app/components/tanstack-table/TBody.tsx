import { flexRender } from "@tanstack/react-table";

import useTable from "#app/components/tanstack-table/useTable";
import { cn } from "#app/utils/lib/cn";

const TBody = () => {
  const table = useTable();

  if (!table) return null;
  return (
    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
      {table.getRowModel().rows.map((row) => (
        <tr
          key={row.id}
          className="divide-x divide-gray-200 dark:divide-neutral-700"
        >
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className={cn(
                "size-px whitespace-nowrap px-5 py-3",
                cell.column.columnDef.meta?.cellProps?.className,
              )}
            >
              <span className="text-sm text-gray-800 dark:text-neutral-400">
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
