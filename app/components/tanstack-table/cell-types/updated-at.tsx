import { CellContext } from "@tanstack/react-table";

import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";

// biome-ignore lint/suspicious/noExplicitAny: Known Tanstack issue
export const tableCellUpdatedAt = (info: CellContext<any, string>) => {
  return info.getValue() ? timeStampToHuman(info.getValue()) : null; // allow null values
};
