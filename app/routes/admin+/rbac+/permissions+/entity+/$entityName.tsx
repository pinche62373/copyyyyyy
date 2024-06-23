import type { LoaderFunctionArgs } from "@remix-run/node";
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
import { getCellTypeVisibleRowIndex } from "#app/components/tanstack-table/cell-types";
import { fuzzyFilter } from "#app/components/tanstack-table/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/fuzzy-sort";
import { TableBar } from "#app/components/tanstack-table/TableBar";
import { TableFilterDropdown } from "#app/components/tanstack-table/TableFilterDropdown";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearchInput } from "#app/components/tanstack-table/TableSearchInput";
import { getPermissionsByEntityName } from "#app/models/permission.server";
import { getCrud } from "#app/utils/crud";
import {
  flattenPermissions,
  requireRoutePermission,
} from "#app/utils/permissions.server";

const { crudPermission: crud } = getCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, `${crud.index}/entity/view`);

  const entityName = z.coerce.string().parse(params.entityName);

  const permissions = await getPermissionsByEntityName(entityName);

  if (!permissions) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  const flattenedPermissions = flattenPermissions(permissions);

  return {
    entityName,
    permissions: flattenedPermissions,
  };
}

interface Permission {
  id: string;
  action: string;
  scope: string;
  role: string;
}

const columnHelper = createColumnHelper<Permission>();

const columns = [
  columnHelper.display({
    id: "index",
    header: "#",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row, table }) => getCellTypeVisibleRowIndex({ row, table }),
  }),
  columnHelper.accessor("action", {
    header: () => <span>Action</span>,
    filterFn: "fuzzy", //using our custom fuzzy filter function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("scope", {
    header: () => <span>Scope</span>,
    enableGlobalFilter: true,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("role", {
    header: () => <span>Role</span>,
    enableGlobalFilter: true,
    cell: (info) => info.getValue(),
  }),
];

export default function Component() {
  const { entityName, permissions } = useLoaderData<typeof loader>();

  const entityType = permissions[0].action === "access" ? "Route" : "Model";

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "entity", // MUST be here or global filter will not sort by rankingValue
      desc: false,
    },
  ]);

  const table = useReactTable({
    data: permissions,
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
        title={`${entityType} permissions for ${entityName}`}
        buttonText="Close"
        buttonTarget={crud.index}
      />

      {/* Start Permissions Table*/}
      <AdminContentCard>
        <TableBar>
          <TableSearchInput
            value={globalFilter ?? ""}
            onChange={(value: string | number) =>
              setGlobalFilter(String(value))
            }
            placeholder="Search permissions..."
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
