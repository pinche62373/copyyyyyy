import { CellContext } from "@tanstack/react-table";

import { timeStampToHuman } from "#app/utils/misc";

// -----------------------------------------------------
/* eslint-disable  @typescript-eslint/no-explicit-any */
// -----------------------------------------------------
export const getCellUpdatedAt = (info: CellContext<any, string>) => {
  return info.getValue()
    ? timeStampToHuman(info.getValue())
    : null; // allow null values
};
