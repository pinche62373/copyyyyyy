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
  tableCellActions,
  tableCellCreatedAt,
  tableCellLink,
  tableCellUpdatedAt,
  tableCellVisibleRowIndex,
} from "#app/components/tanstack-table/cell-types";
import { fuzzyFilter } from "#app/components/tanstack-table/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/fuzzy-sort";
import { TableBar } from "#app/components/tanstack-table/TableBar";
import { TableFilterDropdown } from "#app/components/tanstack-table/TableFilterDropdown";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearchInput } from "#app/components/tanstack-table/TableSearchInput";
import { getLanguages } from "#app/models/language.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { userTableCellActions } from "#app/utils/admin-table";
import {
  ADMIN_TABLE_PAGE_INDEX,
  ADMIN_TABLE_PAGE_SIZE,
} from "#app/utils/constants";
import { humanize } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { useUser } from "#app/utils/user";
import { languageSchemaAdminTable } from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireRoutePermission(request, {
    resource: crud.routes.index,
    scope: "any",
  });

  const languages = await getLanguages();

  return { languages };
};

export default function Component() {
  const { languages } = useLoaderData<typeof loader>();

  const user = useUser();

  const columnHelper =
    createColumnHelper<z.infer<typeof languageSchemaAdminTable>>();

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
        headerProps: {
          className: "table-column-fit-content",
        },
      },
      cell: ({ row, table }) => tableCellVisibleRowIndex({ row, table }),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      filterFn: "fuzzy", //using our custom fuzzy filter function
      sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
      cell: ({ row }) =>
        tableCellLink({
          id: row.original.id,
          name: row.original.name,
          target: crud.routes.index,
        }),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      enableGlobalFilter: false,
      cell: (info) => tableCellCreatedAt(info),
    }),
    columnHelper.accessor("updatedAt", {
      header: "Updated",
      enableGlobalFilter: false,
      cell: (info) => tableCellUpdatedAt(info),
    }),
    ...(userActions
      ? [
          columnHelper.display({
            header: "Actions",
            enableSorting: false,
            enableGlobalFilter: false,
            meta: {
              headerProps: {
                className: "table-column-fit-content",
              },
              cellProps: {
                className: "text-center",
              },
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
    pageIndex: ADMIN_TABLE_PAGE_INDEX,
    pageSize: ADMIN_TABLE_PAGE_SIZE,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name", // MUST be here or global filter will not sort by rankingValue
      desc: false,
    },
  ]);

  const table = useReactTable({
    data: languages,
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
        title={humanize(crud.plural)}
        button={{ title: `New ${humanize(crud.singular)}`, to: crud.routes.new }}
      />

      <AdminContentCard>
        <TableBar>
          <TableSearchInput
            value={globalFilter ?? ""}
            onChange={(value: string | number) =>
              setGlobalFilter(String(value))
            }
            placeholder={`Search ${crud.plural}...`}
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
