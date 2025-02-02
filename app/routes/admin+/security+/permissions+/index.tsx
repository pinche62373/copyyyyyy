import {
  type FilterFnOption,
  type SortingState,
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
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title.tsx";
import { Flex } from "#app/components/flex.tsx";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { getPermissions } from "#app/queries/permission.server.ts";
import TanstackTable from "#app/ui/upstream/table";
import { TableFooter } from "#app/ui/upstream/table/TableFooter";
import { TableSearch } from "#app/ui/upstream/table/TableSearch";
import { TableIndex } from "#app/ui/upstream/table/cells/table-index.tsx";
import { TableLink } from "#app/ui/upstream/table/cells/table-link.tsx";
import { fuzzyFilter } from "#app/ui/upstream/table/filters/fuzzy-filter";
import { permissionTypeFilter } from "#app/ui/upstream/table/filters/permission-type-filter";
import { PermissionTypeFilterComponent } from "#app/ui/upstream/table/filters/permission-type-filter-component";
import { fuzzySort } from "#app/ui/upstream/table/sorts/fuzzy";
import { getAdminCrud } from "#app/utils/admin-crud";
import {
  ADMIN_TABLE_PAGE_INDEX,
  ADMIN_TABLE_PAGE_SIZE,
} from "#app/utils/constants";
import { humanize } from "#app/utils/lib/humanize";
import {
  flattenPermissions,
  requireRoutePermission,
} from "#app/utils/permissions.server";

const { resourceCrud, permissionCrud } = getAdminCrud();

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [
    { name: "Security" },
    { name: humanize(permissionCrud.plural), to: permissionCrud.routes.index },
  ],
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const permissions = await getPermissions();
  const flattenedPermissions = flattenPermissions(permissions);

  return {
    flattenedPermissions,
  };
}

interface FlatPermission {
  id: string;
  resource: string;
  type: string;
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
    cell: ({ row, table }) => TableIndex({ row, table }),
  }),
  columnHelper.accessor("resource", {
    header: "Resource",
    filterFn: "fuzzy", //using our custom fuzzy filter function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    cell: ({ row }) => (
      <TableLink
        label={row.original.resource}
        to={`${resourceCrud.routes.index}/${encodeURIComponent(row.original.resource)}`}
      />
    ),
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => info.getValue(),
    filterFn: permissionTypeFilter as FilterFnOption<FlatPermission>,
  }),
  columnHelper.accessor("action", {
    header: "Action",
    enableGlobalFilter: true,
    enableColumnFilter: true,
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
    cell: ({ row }) => (
      <TableLink
        label={row.original.role}
        to={`/admin/security/roles/${row.original.roleId}`}
      />
    ),
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
      fuzzy: fuzzyFilter,
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

  // passes selected value to the filter function set on the `action` column
  type Filter = "all" | "model" | "route";

  const handleFilter = (filter: Filter) => {
    table.getColumn("type")?.setFilterValue(filter);
  };

  return (
    <>
      <BackendPanel>
        <BackendTitle text={humanize(permissionCrud.plural)} foreground />

        <Flex className="flex-row">
          <Flex.Start>
            <TableSearch
              value={globalFilter ?? ""}
              onChange={(value: string | number) =>
                setGlobalFilter(String(value))
              }
              placeholder={`Search ${permissionCrud.plural}...`}
            />
          </Flex.Start>

          <Flex.End className="ml-5 items-end grow">
            <PermissionTypeFilterComponent
              onClick={(value: Filter) => handleFilter(value)}
            />
          </Flex.End>
        </Flex>

        <TanstackTable.Table table={table} className="mt-5">
          <TanstackTable.THead />
          <TanstackTable.TBody />
        </TanstackTable.Table>

        <TableFooter table={table} />
      </BackendPanel>
    </>
  );
}
