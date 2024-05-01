import { CellContext } from "@tanstack/react-table";
import dayjs from "dayjs";

// -----------------------------------------------------
/* eslint-disable  @typescript-eslint/no-explicit-any */
// -----------------------------------------------------
export const getCellUpdatedAt = (info: CellContext<any, string>) => {
  return info.getValue()
    ? dayjs(info.getValue()).format("YYYY-MM-DD, HH:mm")
    : null; // allow null values
};
