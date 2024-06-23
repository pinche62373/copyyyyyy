import { CellContext } from "@tanstack/react-table";

import { timeStampToHuman } from "#app/utils/misc";

// -----------------------------------------------------
/* eslint-disable  @typescript-eslint/no-explicit-any */
// -----------------------------------------------------
export const getCellCreatedAt = (info: CellContext<any, string>) => {
  return timeStampToHuman(info.getValue())
};
