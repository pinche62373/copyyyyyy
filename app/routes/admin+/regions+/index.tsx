import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { jsonWithError, jsonWithSuccess } from "remix-toast";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import TanstackTable from "#app/components/tanstack-table";
import {
  getCellActionIcons,
  getCellCreatedAt,
  getCellLinkToSelf,
  getCellTypeVisibleRowIndex,
  getCellUpdatedAt,
} from "#app/components/tanstack-table/cell-types";
import { fuzzyFilter } from "#app/components/tanstack-table/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/fuzzy-sort";
import { TableBar } from "#app/components/tanstack-table/TableBar";
import { TableFilterDropdown } from "#app/components/tanstack-table/TableFilterDropdown";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearchInput } from "#app/components/tanstack-table/TableSearchInput";
import { deleteRegion, getAdminRegions } from "#app/models/region.server";
import { regionSchema } from "#app/validations/region-schema";
import { validateFormIntent } from "#app/validations/validate-form-intent";

export const loader = async () => {
  const regions = await getAdminRegions();

  return regions;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "delete");

  const submission = parseWithZod(formData, {
    schema: regionSchema.pick({ id: true }),
  });

  if (submission.status !== "success") {
    return jsonWithError(null, "Invalid delete submission");
  }

  try {
    await deleteRegion(submission.value);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return jsonWithSuccess(null, "Region deleted successfully");
};

interface Region {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

const columnHelper = createColumnHelper<Region>();

const columns = [
  columnHelper.display({
    id: "index",
    header: "#",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row, table }) => getCellTypeVisibleRowIndex({ row, table }),
  }),
  columnHelper.accessor("name", {
    header: () => <span>Region</span>,
    filterFn: "fuzzy", //using our custom fuzzy filter function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    cell: (info) => getCellLinkToSelf(info),
  }),
  columnHelper.accessor("createdAt", {
    header: () => <span>Created</span>,
    enableGlobalFilter: false,
    cell: (info) => getCellCreatedAt(info),
  }),
  columnHelper.accessor("updatedAt", {
    header: () => <span>Updated</span>,
    enableGlobalFilter: false,
    cell: (info) => getCellUpdatedAt(info),
  }),
  columnHelper.display({
    header: "Actions",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: (info) =>
      getCellActionIcons({
        info,
        target: "/admin/regions",
      }),
  }),
];

export default function Component() {
  const data = useLoaderData<typeof loader>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name", // MUST be here or global filter will not sort by rankingValue
      desc: false,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    state: {
      pagination,
      globalFilter,
      sorting,
    },
    enableGlobalFilter: true,
    globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter
    enableSortingRemoval: false,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  return (
    <>
      <AdminPageTitle
        title="Regions"
        buttonText="New Region"
        buttonTarget="/admin/regions/new"
      />

      <AdminContentCard>
        <TableBar>
          <TableSearchInput
            value={globalFilter ?? ""}
            onChange={(value: string | number) =>
              setGlobalFilter(String(value))
            }
            placeholder="Search regions..."
          />
          <TableFilterDropdown />
        </TableBar>

        <TanstackTable.Table table={table}>
          <TanstackTable.THead />
          <TanstackTable.TBody />
        </TanstackTable.Table>
      </AdminContentCard>

      <TableFooter table={table} />
    </>
  );
}
