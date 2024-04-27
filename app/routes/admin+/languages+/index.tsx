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
        <TanstackTable.THead isSortable />
        <TanstackTable.TBody />
      </TanstackTable.Table>

      <br />
    </>
  );
}
