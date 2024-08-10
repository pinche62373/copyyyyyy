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

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import TanstackTable from "#app/components/tanstack-table";
import {
  tableCellLink,
  tableCellVisibleRowIndex,
} from "#app/components/tanstack-table/cell-types";
import { fuzzyFilter } from "#app/components/tanstack-table/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/fuzzy-sort";
import { TableBar } from "#app/components/tanstack-table/TableBar";
import { TableFilterDropdown } from "#app/components/tanstack-table/TableFilterDropdown";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearchInput } from "#app/components/tanstack-table/TableSearchInput";
import { getPermissions } from "#app/models/permission.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import {
  ADMIN_TABLE_PAGE_INDEX,
  ADMIN_TABLE_PAGE_SIZE,
} from "#app/utils/constants";
import {
  flattenPermissions,
  requireRoutePermission,
} from "#app/utils/permissions.server";

const { resourceCrud, permissionCrud } = getAdminCrud();

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: permissionCrud.routes.index,
    scope: "any",
  });

  const permissions = await getPermissions();
  const flattenedPermissions = flattenPermissions(permissions);

  return { flattenedPermissions };
}

interface FlatPermission {
  id: string;
  resource: string;
  action: string;
  scope: string;
  role: string;
  roleId: string;
}

const columnHelper = createColumnHelper<FlatPermission>();

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
  columnHelper.accessor("resource", {
    header: "Resource",
    filterFn: "fuzzy", //using our custom fuzzy filter function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    cell: ({ row }) =>
      tableCellLink({
        id: row.original.resource,
        name: row.original.resource,
        target: resourceCrud.routes.index,
      }),
  }),
  columnHelper.accessor("action", {
    header: "Action",
    enableGlobalFilter: true,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("scope", {
    header: "Scope",
    enableGlobalFilter: true,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("role", {
    header: "Role",
    enableGlobalFilter: true,
    cell: ({ row }) =>
      tableCellLink({
        id: row.original.roleId,
        name: row.original.role,
        target: "/admin/rbac/roles",
      }),
  }),
];

export default function Component() {
  const { flattenedPermissions } = useLoaderData<typeof loader>();

  const [pagination, setPagination] = useState({
    pageIndex: ADMIN_TABLE_PAGE_INDEX,
    pageSize: ADMIN_TABLE_PAGE_SIZE,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "resource", // MUST be here or global filter will not sort by rankingValue
      desc: false,
    },
  ]);

  const table = useReactTable({
    data: flattenedPermissions,
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
      <AdminPageTitle title="Permissions" />

      <AdminContentCard>
        <TableBar>
          <TableSearchInput
            value={globalFilter ?? ""}
            onChange={(value: string | number) =>
              setGlobalFilter(String(value))
            }
            placeholder={`Search ${permissionCrud.plural}...`}
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
