import {
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
import { z } from "zod";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title.tsx";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { getPermissionsByResourceName } from "#app/queries/permission.server.ts";
import { handle as permissionsHandle } from "#app/routes/admin+/security+/permissions+/index";
import TanstackTable from "#app/ui/upstream/table";
import { TableFooter } from "#app/ui/upstream/table/TableFooter";
import { TableSearch } from "#app/ui/upstream/table/TableSearch";
import { TableIndex } from "#app/ui/upstream/table/cells/table-index.tsx";
import { fuzzyFilter } from "#app/ui/upstream/table/filters/fuzzy-filter";
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

const { resourceCrud: crud } = getAdminCrud();

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [
    ...permissionsHandle.breadcrumb(),
    { name: "Resource" },
  ],
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  console.log("Resource crud", crud);

  await requireRoutePermission(request, {
    resource: crud.routes.view,
    scope: "any",
  });

  const resourceName = z.coerce.string().parse(params.resourceName);

  const permissions = await getPermissionsByResourceName(resourceName);

  if (permissions.length === 0) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  const flattenedPermissions = flattenPermissions(permissions);

  return {
    resourceName,
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
    meta: {
      headerProps: {
        className: "table-column-fit-content",
      },
    },
    cell: ({ row, table }) => TableIndex({ row, table }),
  }),
  columnHelper.accessor("action", {
    header: "Action",
    filterFn: "fuzzy", //using our custom fuzzy filter function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
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
    cell: (info) => info.getValue(),
  }),
];

export default function Component() {
  const { resourceName, permissions } = useLoaderData<typeof loader>();

  const [pagination, setPagination] = useState({
    pageIndex: ADMIN_TABLE_PAGE_INDEX,
    pageSize: ADMIN_TABLE_PAGE_SIZE,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "action", // MUST be here or global filter will not sort by rankingValue
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
      <BackendPanel>
        <BackendTitle
          text={`${humanize(permissions[0].type)} permissions for ${resourceName}`}
          foreground
        />

        <TableSearch
          value={globalFilter ?? ""}
          onChange={(value: string | number) => setGlobalFilter(String(value))}
          placeholder={`Search permissions`}
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
