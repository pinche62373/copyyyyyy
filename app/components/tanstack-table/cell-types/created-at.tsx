import { CellContext } from "@tanstack/react-table";
import dayjs from "dayjs";

// -----------------------------------------------------
// TODO: fix <any> type check
// -----------------------------------------------------
/* eslint-disable  @typescript-eslint/no-explicit-any */
// -----------------------------------------------------
export const getCellCreatedAt = (info: CellContext<any, string>) => {
 return dayjs(info.getValue()).format("YYYY-MM-DD, HH:mm");
};
