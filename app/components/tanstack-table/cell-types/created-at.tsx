import { CellContext } from "@tanstack/react-table";

import { timeStampToHuman } from "#app/utils/lib/timestamp-to-human";

// biome-ignore lint/suspicious/noExplicitAny: Known Tanstack issue
export const tableCellCreatedAt = (info: CellContext<any, string>) => {
  return timeStampToHuman(info.getValue());
};
