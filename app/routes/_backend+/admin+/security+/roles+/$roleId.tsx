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
import { z } from "zod";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title.tsx";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import TanstackTable from "#app/components/tanstack-table";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearch } from "#app/components/tanstack-table/TableSearch";
import { TableIndex } from "#app/components/tanstack-table/cells/table-index.tsx";
import { TableLink } from "#app/components/tanstack-table/cells/table-link.tsx";
import { fuzzyFilter } from "#app/components/tanstack-table/filters/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/sorts/fuzzy";
import { Pairs } from "#app/components/ui/pairs.tsx";
import { getRoleWithPermissions } from "#app/models/role.server";
import { handle as rolesHandle } from "#app/routes/_backend+/admin+/security+/roles+/index";
import { getAdminCrud } from "#app/utils/admin-crud";
import {
  ADMIN_TABLE_PAGE_INDEX,
  ADMIN_TABLE_PAGE_SIZE,
} from "#app/utils/constants";
import { humanize } from "#app/utils/lib/humanize";
import { requireRoutePermission } from "#app/utils/permissions.server";

const { roleCrud, resourceCrud } = getAdminCrud();

export const handle = {
  breadcrumb: ({
    data,
  }: {
    data: { role: { id: string; name: string } };
  }): BreadcrumbHandle => [
    ...rolesHandle.breadcrumb(),
    { name: humanize(data.role.name) },
  ],
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const roleId = z.coerce.string().parse(params.roleId);

  const role = await getRoleWithPermissions({ id: roleId });

  if (!role) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return {
    role,
  };
}

interface Permission {
  id: string;
  resource: string;
  action: string;
  scope: string;
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
  columnHelper.accessor("resource", {
    header: () => <span>Resource</span>,
    filterFn: "fuzzy", //using our custom fuzzy filter function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    cell: ({ row }) => (
      <TableLink
        label={row.original.resource}
        to={`${resourceCrud.routes.index}/${encodeURIComponent(row.original.resource)}`}
      />
    ),
  }),
  columnHelper.accessor("action", {
    header: () => <span>Action</span>,
    enableGlobalFilter: true,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("scope", {
    header: () => <span>Scope</span>,
    enableGlobalFilter: true,
    cell: (info) => info.getValue(),
  }),
];

export default function Component() {
  const { role } = useLoaderData<typeof loader>();

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
    data: role.permissions,
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
      {/* List role data */}
      <BackendPanel>
        <BackendTitle text={humanize(roleCrud.singular)} foreground />

        <Pairs>
          <Pairs.Key>Name</Pairs.Key>
          <Pairs.Value>{role.name}</Pairs.Value>

          <Pairs.Key>Description</Pairs.Key>
          <Pairs.Value>{role.description}</Pairs.Value>
        </Pairs>
      </BackendPanel>

      {/* Permissions table for role */}
      <BackendPanel className="pb-4">
        <BackendTitle text={"Permissions"} foreground />

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
