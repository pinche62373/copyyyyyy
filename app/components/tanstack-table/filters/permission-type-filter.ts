import { FilterFn } from "@tanstack/react-table";

// Custom filter that returns model OR route permissions
export const permissionTypeFilter: FilterFn<unknown> = (
  row,
  columnId,
  value,
) => {
  if (value === "model") {
    return row.getValue(columnId) === "model";
  }
  if (value === "route") {
    return row.getValue(columnId) === "route";
  }

  return true;
};
