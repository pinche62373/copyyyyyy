import { NavLink, useLoaderData } from "@remix-run/react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { AdminPageTitle } from "~/components/admin/page-title";
import TanstackTable from "~/components/tanstack-table";
import { getAdminLanguages } from "~/models/language.server";

export const loader = async () => {
  const languages = await getAdminLanguages();

  return languages;
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
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
  }),
  columnHelper.accessor("name", {
    cell: (info) => (
      <NavLink
        to={info.row.original.id}
        className="block text-sm font-medium text-gray-800 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 dark:text-white dark:hover:text-white/70 dark:focus:text-white/70"
      >
        {info.getValue()}
      </NavLink>
    ),
    header: () => <span>Language</span>,
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => info.getValue(),
    header: () => <span>Created</span>,
  }),
  columnHelper.accessor("updatedAt", {
    cell: (info) => info.getValue(),
    header: () => <span>Updated</span>,
  }),
  columnHelper.display({
    header: "Actions",
    enableSorting: false,
    cell: () => (
    <>
            {/* Edit Button */}
            <div className="inline-flex items-center -space-x-px">
              <a
                className="size-8 inline-flex justify-center items-center gap-x-2 font-medium rounded-s-lg border border-stone-200 bg-white text-stone-800 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                href="../../pro/ecommerce/product-details.html"
              >
                <svg
                  className="flex-shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </a>
            </div>

            {/* Delete Button */}
            <div className="inline-flex items-center -space-x-px">
              <a
                className="size-8 inline-flex justify-center items-center gap-x-2 font-medium rounded-r-lg border border-stone-200 bg-white text-stone-800 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                href="../../pro/ecommerce/product-details.html"
              >
                <svg
                  className="flex-shrink-0 size-3.5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </a>
            </div>      
            </>      
    )
  }),
];

export default function AdminLanguageIndex() {
  const data = useLoaderData<typeof loader>();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <AdminPageTitle title="Languages" buttonText="New Language"/>

      <TanstackTable.Table table={table}>
        <TanstackTable.THead />
        <TanstackTable.TBody />
      </TanstackTable.Table>

      <br />
    </>
  );
}
