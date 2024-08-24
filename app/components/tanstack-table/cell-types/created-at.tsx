import { CellContext } from "@tanstack/react-table";

import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";

// -----------------------------------------------------
/* eslint-disable  @typescript-eslint/no-explicit-any */
// -----------------------------------------------------
export const tableCellCreatedAt = (info: CellContext<any, string>) => {
  return timeStampToHuman(info.getValue())
};
