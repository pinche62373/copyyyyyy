import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
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
import { jsonWithError, jsonWithSuccess } from "remix-toast";

import { AdminContentCard } from "#app/components/admin/admin-content-card";
import { AdminPageTitle } from "#app/components/admin/admin-page-title";
import TanstackTable from "#app/components/tanstack-table";
import {
  getCellActionIcons,
  getCellCreatedAt,
  getCellLink,
  getCellTypeVisibleRowIndex,
  getCellUpdatedAt,
} from "#app/components/tanstack-table/cell-types";
import { fuzzyFilter } from "#app/components/tanstack-table/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/fuzzy-sort";
import { TableBar } from "#app/components/tanstack-table/TableBar";
import { TableFilterDropdown } from "#app/components/tanstack-table/TableFilterDropdown";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearchInput } from "#app/components/tanstack-table/TableSearchInput";
import { deleteCountry, getCountries } from "#app/models/country.server";
import { getCrud } from "#app/utils/crud";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { countrySchemaFull } from "#app/validations/country-schema";
import { validateFormIntent } from "#app/validations/validate-form-intent";

const { crudCountry: crud } = getCrud();

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireRoutePermission(request, crud.index);

  const countries = await getCountries();

  return { countries };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "delete");

  const submission = parseWithZod(formData, {
    schema: countrySchemaFull.pick({ id: true }),
  });

  if (submission.status !== "success") {
    return jsonWithError(null, "Invalid delete submission");
  }

  try {
    await deleteCountry(submission.value);
  } catch (error) {
    return jsonWithError(null, "Unexpected error");
  }

  return jsonWithSuccess(null, `${crud.singular} deleted successfully`);
};

interface Country {
  // TODO: zod schema, create
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  region: {
    id: string;
    name: string;
  };
}

const columnHelper = createColumnHelper<Country>();

const columns = [
  columnHelper.display({
    id: "index",
    header: "#",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row, table }) => getCellTypeVisibleRowIndex({ row, table }),
  }),
  columnHelper.accessor("name", {
    header: () => <span>Name</span>,
    filterFn: "fuzzy", //using our custom fuzzy filter function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    cell: ({ row }) =>
      getCellLink({
        id: row.original.id,
        name: row.original.name,
        target: crud.index,
      }),
  }),
  columnHelper.accessor("region.name", {
    header: () => <span>Region</span>,
    enableGlobalFilter: true,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("createdAt", {
    header: () => <span>Created</span>,
    enableGlobalFilter: false,
    cell: (info) => getCellCreatedAt(info),
  }),
  columnHelper.accessor("updatedAt", {
    header: () => <span>Updated</span>,
    enableGlobalFilter: false,
    cell: (info) => getCellUpdatedAt(info),
  }),
  columnHelper.display({
    header: "Actions",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: (info) =>
      getCellActionIcons({
        info,
        crud,
        actions: {
          edit: true,
          delete: false,
        },        
      }),
  }),
];

export default function Component() {
  const { countries } = useLoaderData<typeof loader>();

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
    data: countries,
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
        buttonText={`New ${crud.singular}`}
        buttonTarget={`${crud.index}/new`}
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
