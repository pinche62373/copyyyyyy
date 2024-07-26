import { LoaderFunctionArgs } from "@remix-run/node";
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
import { z } from "zod";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import TanstackTable from "#app/components/tanstack-table";
import {
  getCellCreatedAt,
  getCellLink,
  getCellTypeVisibleRowIndex,
  getCellUpdatedAt,
  tableCellActions,
} from "#app/components/tanstack-table/cell-types";
import { fuzzyFilter } from "#app/components/tanstack-table/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/fuzzy-sort";
import { TableBar } from "#app/components/tanstack-table/TableBar";
import { TableFilterDropdown } from "#app/components/tanstack-table/TableFilterDropdown";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearchInput } from "#app/components/tanstack-table/TableSearchInput";
import { getRegions } from "#app/models/region.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { userTableCellActions } from "#app/utils/admin-table";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { useUser } from "#app/utils/user";
import { regionSchemaAdminTable } from "#app/validations/region-schema";

const { regionCrud: crud } = getAdminCrud();

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireRoutePermission(request, crud.routes.index);

  const regions = await getRegions();

  return { regions };
};

export default function Component() {
  const { regions } = useLoaderData<typeof loader>();

  const user = useUser();

  const columnHelper =
    createColumnHelper<z.infer<typeof regionSchemaAdminTable>>();

  const userActions = userTableCellActions({
    user,
    route: crud.routes.index,
    actions: "edit",
  });

  const columns = [
    columnHelper.display({
      id: "index",
      header: "#",
      enableSorting: false,
      enableGlobalFilter: false,
      meta: {
        className: "table-column-fit-content",
      },
      cell: ({ row, table }) => getCellTypeVisibleRowIndex({ row, table }),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      filterFn: "fuzzy", //using our custom fuzzy filter function
      sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
      cell: ({ row }) =>
        getCellLink({
          id: row.original.id,
          name: row.original.name,
          target: crud.routes.index,
        }),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      enableGlobalFilter: false,
      cell: (info) => getCellCreatedAt(info),
    }),
    columnHelper.accessor("updatedAt", {
      header: "Updated",
      enableGlobalFilter: false,
      cell: (info) => getCellUpdatedAt(info),
    }),
    ...(userActions
      ? [
          columnHelper.display({
            header: "Actions",
            enableSorting: false,
            enableGlobalFilter: false,
            meta: {
              className: "table-column-fit-content",
            },
            cell: (info) =>
              tableCellActions({
                info,
                crud,
                actions: userActions,
              }),
          }),
        ]
      : []),
  ];

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
    data: regions,
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
        title={crud.plural}
        button={{ title: `New ${crud.singular}`, to: crud.routes.new }}
      />

      <AdminContentCard>
        <TableBar>
          <TableSearchInput
            value={globalFilter ?? ""}
            onChange={(value: string | number) =>
              setGlobalFilter(String(value))
            }
            placeholder={`Search ${crud.plural.toLowerCase()}...`}
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
