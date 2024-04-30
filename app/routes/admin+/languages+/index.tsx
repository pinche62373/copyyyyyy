import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, NavLink, useLoaderData } from "@remix-run/react";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { useState } from "react";
import invariant from "tiny-invariant";

import { AdminContentCard } from "#app/components/admin/content-card";
import { AdminPageTitle } from "#app/components/admin/page-title";
import { IconEdit } from "#app/components/icons/edit";
import { IconTrash } from "#app/components/icons/trash";
import TanstackTable from "#app/components/tanstack-table";
import { fuzzyFilter } from "#app/components/tanstack-table/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/fuzzy-sort";
import { TableBar } from "#app/components/tanstack-table/TableBar";
import { TableFilterDropdown } from "#app/components/tanstack-table/TableFilterDropdown";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearchInput } from "#app/components/tanstack-table/TableSearchInput";
import { deleteLanguage, getAdminLanguages } from "#app/models/language.server";

export const loader = async () => {
  const languages = await getAdminLanguages();

  return languages;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { languageId } = Object.fromEntries(formData.entries());

  invariant(languageId, "Form data does not contain languageId");

  await deleteLanguage({ id: languageId.toString() });

  return { status: "success" };
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
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
  }),
  columnHelper.accessor("name", {
    header: () => <span>Language</span>,
    filterFn: "fuzzy", //using our custom fuzzy filter function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    cell: (info) => (
      <NavLink
        to={info.row.original.id}
        className="block text-sm font-medium text-gray-800 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 dark:text-white dark:hover:text-white/70 dark:focus:text-white/70"
      >
        {info.getValue()}
      </NavLink>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: () => <span>Created</span>,
    enableGlobalFilter: false,
    cell: (info) => {
      return dayjs(info.getValue()).format("YYYY-MM-DD, HH:mm");
    },
  }),
  columnHelper.accessor("updatedAt", {
    header: () => <span>Updated</span>,
    enableGlobalFilter: false,
    cell: (info) => {
      return info.getValue()
        ? dayjs(info.getValue()).format("YYYY-MM-DD, HH:mm")
        : null;
    },
  }),
  columnHelper.display({
    header: "Actions",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: (info) => (
      <>
        {/* Edit Button */}
        <div className="inline-flex items-center -space-x-px">
          <button
            className="size-8 inline-flex justify-center items-center gap-x-2 font-medium rounded-s-lg border border-stone-200 bg-white text-stone-800 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            onClick={() => alert("Edit")}
          >
            <IconEdit className="flex-shrink-0 size-3.5" />
          </button>
        </div>
        {/* End Edit Button */}

        {/* Delete Button */}
        <div className="inline-flex items-center -space-x-px">
          <Form
            method="POST"
            action="/admin/languages"
            onSubmit={(event) => {
              if (!confirm("Are you sure?")) {
                event.preventDefault();
              }
            }}
          >
            <input
              type="hidden"
              name="languageId"
              value={info.row.original.id}
            />
            <input type="hidden" name="intent" value="delete" />
            <button className="size-8 inline-flex justify-center items-center gap-x-2 font-medium rounded-r-lg border border-stone-200 bg-white text-stone-800 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700  hover:fill-red-500">
              <IconTrash className="flex-shrink-0 size-3.5" />
            </button>
          </Form>
        </div>
        {/* End Delete Button */}
      </>
    ),
  }),
];

export default function AdminPageLanguages() {
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
