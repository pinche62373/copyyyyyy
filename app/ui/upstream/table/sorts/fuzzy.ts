import { compareItems } from "@tanstack/match-sorter-utils";
import { type Row, type SortingFn, sortingFns } from "@tanstack/react-table";

/**
 * Define a custom fuzzy sort function that will sort by rank if the row has ranking information
 */

// biome-ignore lint/suspicious/noExplicitAny: Known Tanstack issue
export const fuzzySort: SortingFn<any> | undefined = (
  rowA: Row<unknown>,
  rowB: Row<unknown>,
  columnId: string,
) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank,
      rowB.columnFiltersMeta[columnId]?.itemRank,
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};
