import { useLoaderData } from "@remix-run/react";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { AdminPageTitleList } from "~/components/admin/page-title-list";
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
    header: "#",
    id: "index",
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
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
      <AdminPageTitleList model="Languages" />

      <TanstackTable.Table table={table}>
        <TanstackTable.THead isSortable />
        <TanstackTable.TBody />
      </TanstackTable.Table>
    </>
  );
}
