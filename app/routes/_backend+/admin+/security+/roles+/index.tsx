import {
  SortingState,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import z from "zod";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title.tsx";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import TanstackTable from "#app/components/tanstack-table";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearch } from "#app/components/tanstack-table/TableSearch";
import { tableCellVisibleRowIndex } from "#app/components/tanstack-table/cell-types";
import { TableLink } from "#app/components/tanstack-table/cells/table-link.tsx";
import { fuzzyFilter } from "#app/components/tanstack-table/filters/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/sorts/fuzzy";
import { getRoles } from "#app/models/role.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import {
  ADMIN_TABLE_PAGE_INDEX,
  ADMIN_TABLE_PAGE_SIZE,
} from "#app/utils/constants";
import { humanize } from "#app/utils/lib/humanize";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { RoleSchemaAdminTable } from "#app/validations/role-schema.ts";

const { roleCrud: crud } = getAdminCrud();

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [
    { name: "Security" },
    { name: humanize(crud.plural), to: crud.routes.index },
  ],
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const roles = await getRoles();

  return {
    roles,
  };
}

const columnHelper = createColumnHelper<z.infer<typeof RoleSchemaAdminTable>>();

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
    cell: ({ row }) => (
      <TableLink to={`${crud.routes.index}/${row.original.id}`}>
        {row.original.name}
      </TableLink>
    ),
  }),
  columnHelper.accessor("description", {
    header: "Description",
    enableGlobalFilter: true,
    enableSorting: false,
    cell: (info) => info.getValue(),
  }),
];

export default function Component() {
  const { roles } = useLoaderData<typeof loader>();

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
    data: roles,
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
      <BackendPanel>
        <BackendTitle text={humanize(crud.plural)} foreground />

        <TableSearch
          value={globalFilter ?? ""}
          onChange={(value: string | number) => setGlobalFilter(String(value))}
          placeholder={`Search ${crud.plural}...`}
        />

        <TanstackTable.Table table={table} className="mt-5">
          <TanstackTable.THead />
          <TanstackTable.TBody />
        </TanstackTable.Table>

        <TableFooter table={table} />
      </BackendPanel>
    </>
  );
}
