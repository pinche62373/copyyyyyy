import { parseWithZod } from "@conform-to/zod";
import type { ActionFunctionArgs } from "@remix-run/node";
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
  getCellLinkToSelf,
  getCellTypeVisibleRowIndex,
  getCellUpdatedAt,
} from "#app/components/tanstack-table/cell-types";
import { fuzzyFilter } from "#app/components/tanstack-table/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/fuzzy-sort";
import { TableBar } from "#app/components/tanstack-table/TableBar";
import { TableFilterDropdown } from "#app/components/tanstack-table/TableFilterDropdown";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearchInput } from "#app/components/tanstack-table/TableSearchInput";
import { deleteLanguage, getAdminLanguages } from "#app/models/language.server";
import { languageSchema } from "#app/validations/language-schema";
import { validateFormIntent } from "#app/validations/validate-form-intent";

export const loader = async () => {
  const languages = await getAdminLanguages();

  return languages;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  validateFormIntent(formData, "delete");

  const submission = parseWithZod(formData, {
    schema: languageSchema.pick({ id: true }),
  });

  if (submission.status !== "success") {
    return jsonWithError(null, "Invalid delete submission")
  }

  try {
    await deleteLanguage(submission.value);
  } catch(error) {
    return jsonWithError(null, "Unexpected error")
  }

  return jsonWithSuccess(null, "Language deleted successfully")
};

interface Language {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
}

const columnHelper = createColumnHelper<Language>();

const columns = [
  columnHelper.display({
    id: "index",
    header: "#",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row, table }) => getCellTypeVisibleRowIndex({ row, table }),
  }),
  columnHelper.accessor("name", {
    header: () => <span>Language</span>,
    filterFn: "fuzzy", //using our custom fuzzy filter function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    cell: (info) => getCellLinkToSelf(info),
  }),
  columnHelper.accessor("createdAt", {
    header: () => <span>Created</span>,
    enableGlobalFilter: false,
    cell: (info) => getCellCreatedAt(info),
  }),
  columnHelper.accessor("updatedAt", {
    header: () => <span>Updated</span>,
    enableGlobalFilter: false,
    cell: (info) => getCellUpdatedAt( info ),
  }),
  columnHelper.display({
    header: "Actions",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: (info) => getCellActionIcons(info),
  }),
];

export default function Component() {
  const data = useLoaderData<typeof loader>();

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
    data,
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
      <AdminPageTitle title="Languages" buttonText="New Language" />

      <AdminContentCard>
        <TableBar>
          <TableSearchInput
            value={globalFilter ?? ""}
            onChange={(value: string | number) =>
              setGlobalFilter(String(value))
            }
            placeholder="Search languages..."
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
