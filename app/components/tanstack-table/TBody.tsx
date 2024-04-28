import { flexRender } from '@tanstack/react-table';

import useTable from './useTable';

const TBody = () => {
  const table = useTable();

  if (!table) return null;
  return (
    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="size-px whitespace-nowrap py-3 px-5">
              <span className="text-sm text-gray-800 dark:text-white">
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
