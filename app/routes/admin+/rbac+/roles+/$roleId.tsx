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
import { Button } from "#app/components/admin/button";
import { FormFooter } from "#app/components/admin/form/form-footer";
import { FormInputTextReadOnly } from "#app/components/admin/form/form-input-text-readonly";
import TanstackTable from "#app/components/tanstack-table";
import {
  getCellLink,
  getCellTypeVisibleRowIndex,
} from "#app/components/tanstack-table/cell-types";
import { fuzzyFilter } from "#app/components/tanstack-table/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/fuzzy-sort";
import { TableBar } from "#app/components/tanstack-table/TableBar";
import { TableFilterDropdown } from "#app/components/tanstack-table/TableFilterDropdown";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearchInput } from "#app/components/tanstack-table/TableSearchInput";
import { getRoleWithPermissions } from "#app/models/role.server";
import { getCrud } from "#app/utils/crud";
import { requireRoutePermission } from "#app/utils/permissions.server";
const { crudRole: crud } = getCrud();

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRoutePermission(request, `${crud.index}/view`);

  const roleId = z.coerce.string().parse(params.roleId);

  const role = await getRoleWithPermissions({ id: roleId });

  if (!role) {
    throw new Response("Not Found", { status: 404, statusText: "Not Found" });
  }

  return { role };
}

interface Permission {
  id: string;
  entity: string;
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
    cell: ({ row, table }) => getCellTypeVisibleRowIndex({ row, table }),
  }),
  columnHelper.accessor("entity", {
    header: () => <span>Entity</span>,
    filterFn: "fuzzy", //using our custom fuzzy filter function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    cell: ({ row }) =>
      getCellLink({
        id: row.original.id,
        name: row.original.entity,
        target: "/admin/rbac/entities",
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
      <AdminPageTitle title={`View ${crud.singular}`} />

      <AdminContentCard className="p-6">
        <FormInputTextReadOnly label="Name">{role.name}</FormInputTextReadOnly>

        <FormInputTextReadOnly label="Description">
          {role.description}
        </FormInputTextReadOnly>

        <FormFooter>
          <Button type="button" text="Close" to={crud.index} />
        </FormFooter>
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
