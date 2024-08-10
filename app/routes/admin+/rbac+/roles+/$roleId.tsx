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
import { FormInputTextReadOnly } from "#app/components/admin/form/form-input-text-readonly";
import TanstackTable from "#app/components/tanstack-table";
import {
  tableCellLink,
  tableCellVisibleRowIndex,
} from "#app/components/tanstack-table/cell-types";
import { fuzzyFilter } from "#app/components/tanstack-table/filters/fuzzy";
import { fuzzySort } from "#app/components/tanstack-table/sorts/fuzzy";
import { TableBar } from "#app/components/tanstack-table/TableBar";
import { TableFilterDropdown } from "#app/components/tanstack-table/TableFilterDropdown";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearchInput } from "#app/components/tanstack-table/TableSearchInput";
import { getRoleWithPermissions } from "#app/models/role.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import {
  ADMIN_TABLE_PAGE_INDEX,
  ADMIN_TABLE_PAGE_SIZE,
} from "#app/utils/constants";
import { humanize } from "#app/utils/misc";
import { requireRoutePermission } from "#app/utils/permissions.server";

const { roleCrud, resourceCrud } = getAdminCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, {
    resource: roleCrud.routes.view,
    scope: "any",
  });

  const roleId = z.coerce.string().parse(params.roleId);

  const role = await getRoleWithPermissions({ id: roleId });

  if (!role) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return { role };
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
    cell: ({ row, table }) => tableCellVisibleRowIndex({ row, table }),
  }),
  columnHelper.accessor("resource", {
    header: () => <span>Resource</span>,
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
      {/* Start Database Fields */}
      <AdminPageTitle title={`View ${humanize(roleCrud.singular)}`} />

      <AdminContentCard className="p-6">
        <FormInputTextReadOnly label="Name">{role.name}</FormInputTextReadOnly>

        <FormInputTextReadOnly label="Description">
          {role.description}
        </FormInputTextReadOnly>
      </AdminContentCard>

      {/* Start Permissions Table*/}
      <AdminPageTitle title="Permissions" className="pt-4" />

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
