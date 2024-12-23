import { zodResolver } from "@hookform/resolvers/zod";
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
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getValidatedFormData } from "remix-hook-form";
import { dataWithError, dataWithSuccess } from "remix-toast";
import zod, { z } from "zod";
import { BackendPanel } from "#app/components/backend/panel";
import { BackendTitle } from "#app/components/backend/title";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import { Button } from "#app/components/shared/button";
import TanstackTable from "#app/components/tanstack-table";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearch } from "#app/components/tanstack-table/TableSearch";
import {
  tableCellActions,
  tableCellCreatedAt,
  tableCellLink,
  tableCellUpdatedAt,
  tableCellVisibleRowIndex,
} from "#app/components/tanstack-table/cell-types";
import { fuzzyFilter } from "#app/components/tanstack-table/filters/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/sorts/fuzzy";
import { deleteLanguage, getLanguages } from "#app/models/language.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { requireUserId } from "#app/utils/auth.server";
import {
  ADMIN_TABLE_PAGE_INDEX,
  ADMIN_TABLE_PAGE_SIZE,
} from "#app/utils/constants";
import { getUserTableCellActions } from "#app/utils/get-user-table-cell-actions";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission,
} from "#app/utils/permissions.server";
import { useUser, userHasRoutePermission } from "#app/utils/user";
import {
  languageSchemaAdminTable,
  languageSchemaDelete,
} from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

const intent = "delete" as const;

const resolver = zodResolver(languageSchemaDelete);

type FormData = zod.infer<typeof languageSchemaDelete>;

export const handle = {
  breadcrumb: (): BreadcrumbHandle => [
    { name: humanize(crud.plural), to: crud.routes.index },
  ],
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any",
  });

  const languages = await getLanguages();

  return {
    languages,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserId(request);

  const { data, errors } = await getValidatedFormData<FormData>(
    request,
    resolver,
  );

  if (errors) {
    return dataWithError({ errors }, "Form data rejected by server", {
      status: 422,
    });
  }

  await requireModelPermission(request, {
    resource: crud.singular,
    action: intent,
    scope: "any",
  });

  try {
    await deleteLanguage(data.language);
  } catch {
    return dataWithError(null, "Unexpected error");
  }

  return dataWithSuccess(
    null,
    `${humanize(crud.singular)} deleted successfully`,
  );
};

export default function Component() {
  const { languages } = useLoaderData<typeof loader>();

  const user = useUser();

  const columnHelper =
    createColumnHelper<z.infer<typeof languageSchemaAdminTable>>();

  const userCellActions = getUserTableCellActions({
    user,
    route: crud.routes.index,
    actions: {
      edit: true,
    },
  });

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
    columnHelper.accessor("name", {
      header: "Name",
      filterFn: "fuzzy", //using our custom fuzzy filter function
      sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
      cell: ({ row }) =>
        tableCellLink({
          id: row.original.id,
          name: row.original.name,
          target: crud.routes.index,
        }),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      enableGlobalFilter: false,
      cell: (info) => tableCellCreatedAt(info),
    }),
    columnHelper.accessor("updatedAt", {
      header: "Updated",
      enableGlobalFilter: false,
      cell: (info) => tableCellUpdatedAt(info),
    }),
    ...(userCellActions
      ? [
          columnHelper.display({
            header: "Actions",
            enableSorting: false,
            enableGlobalFilter: false,
            meta: {
              headerProps: {
                className: "table-column-fit-content",
              },
              cellProps: {
                className: "text-center",
              },
            },
            cell: (info) =>
              tableCellActions({
                info,
                crud,
                actions: userCellActions,
              }),
          }),
        ]
      : []),
  ];

  const [pagination, setPagination] = useState({
    pageIndex: ADMIN_TABLE_PAGE_INDEX,
    pageSize: ADMIN_TABLE_PAGE_SIZE,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name", // MUST be here or global filter will not sort by rankingValue
      desc: false,
    },
  ]);

  const table = useReactTable({
    data: languages,
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
      <BackendPanel className="pb-4">
        <BackendPanel.Row>
          <BackendTitle text={humanize(crud.plural)} foreground />
        </BackendPanel.Row>

        <BackendPanel.Row>
          <BackendPanel.Left>
            <TableSearch
              value={globalFilter ?? ""}
              onChange={(value: string | number) =>
                setGlobalFilter(String(value))
              }
              placeholder={`Search ${crud.plural}...`}
            />
          </BackendPanel.Left>

          <BackendPanel.Right>
            {userHasRoutePermission(user, {
              resource: crud.routes.new,
              scope: "any",
            }) && (
              <Button
                type="button"
                text={`New ${humanize(crud.singular)}`}
                to={crud.routes.new}
                className="mt-0.5"
              />
            )}
          </BackendPanel.Right>
        </BackendPanel.Row>

        <BackendPanel.Row last>
          <TanstackTable.Table table={table}>
            <TanstackTable.THead />
            <TanstackTable.TBody />
          </TanstackTable.Table>

          <TableFooter table={table} />
        </BackendPanel.Row>
      </BackendPanel>
    </>
  );
}
