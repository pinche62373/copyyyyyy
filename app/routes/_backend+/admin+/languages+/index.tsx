import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@rvf/zod";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { useState } from "react";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { namedAction } from "remix-utils/named-action";
import { z } from "zod";

import { BackendContentContainer } from "#app/components/backend/content-container";
import { BackendPageTitle } from "#app/components/backend/page-title";
import { Button } from "#app/components/shared/button";
import TanstackTable from "#app/components/tanstack-table";
import {
  tableCellActions,
  tableCellCreatedAt,
  tableCellLink,
  tableCellUpdatedAt,
  tableCellVisibleRowIndex
} from "#app/components/tanstack-table/cell-types";
import { fuzzyFilter } from "#app/components/tanstack-table/filters/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/sorts/fuzzy";
import { TableBar } from "#app/components/tanstack-table/TableBar";
import { TableFilterDropdown } from "#app/components/tanstack-table/TableFilterDropdown";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearchInput } from "#app/components/tanstack-table/TableSearchInput";
import { deleteLanguage, getLanguages } from "#app/models/language.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import { userTableCellActions } from "#app/utils/admin-table";
import { requireUserId } from "#app/utils/auth.server";
import {
  ADMIN_TABLE_PAGE_INDEX,
  ADMIN_TABLE_PAGE_SIZE
} from "#app/utils/constants";
import { humanize } from "#app/utils/lib/humanize";
import {
  requireModelPermission,
  requireRoutePermission
} from "#app/utils/permissions.server";
import { useUser, userHasRoutePermission } from "#app/utils/user";
import {
  languageSchemaAdminTable,
  languageSchemaDelete
} from "#app/validations/language-schema";

const { languageCrud: crud } = getAdminCrud();

const intent = "delete";

const formValidator = withZod(languageSchemaDelete);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireRoutePermission(request, {
    resource: new URL(request.url).pathname,
    scope: "any"
  });

  const languages = await getLanguages();

  return { languages };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return namedAction(request, {
    async delete() {
      await requireUserId(request);

      const validated = await formValidator.validate(await request.formData());

      if (validated.error)
        return jsonWithError(validated.error, "Form data rejected by server", {
          status: 422
        });

      await requireModelPermission(request, {
        resource: crud.singular,
        action: intent,
        scope: "any"
      });

      try {
        await deleteLanguage(validated.data.language);
      } catch {
        return jsonWithError(null, "Unexpected error");
      }

      return jsonWithSuccess(
        null,
        `${humanize(crud.singular)} deleted successfully`
      );
    }
  });
};

export default function Component() {
  const { languages } = useLoaderData<typeof loader>();

  const user = useUser();

  const columnHelper =
    createColumnHelper<z.infer<typeof languageSchemaAdminTable>>();

  const userActions = userTableCellActions({
    user,
    route: crud.routes.index,
    actions: {
      edit: true
    }
  });

  const columns = [
    columnHelper.display({
      id: "index",
      header: "#",
      enableSorting: false,
      enableGlobalFilter: false,
      meta: {
        headerProps: {
          className: "table-column-fit-content"
        }
      },
      cell: ({ row, table }) => tableCellVisibleRowIndex({ row, table })
    }),
    columnHelper.accessor("name", {
      header: "Name",
      filterFn: "fuzzy", //using our custom fuzzy filter function
      sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
      cell: ({ row }) =>
        tableCellLink({
          id: row.original.id,
          name: row.original.name,
          target: crud.routes.index
        })
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      enableGlobalFilter: false,
      cell: (info) => tableCellCreatedAt(info)
    }),
    columnHelper.accessor("updatedAt", {
      header: "Updated",
      enableGlobalFilter: false,
      cell: (info) => tableCellUpdatedAt(info)
    }),
    ...(userActions
      ? [
          columnHelper.display({
            header: "Actions",
            enableSorting: false,
            enableGlobalFilter: false,
            meta: {
              headerProps: {
                className: "table-column-fit-content"
              },
              cellProps: {
                className: "text-center"
              }
            },
            cell: (info) =>
              tableCellActions({
                info,
                crud,
                actions: userActions
              })
          })
        ]
      : [])
  ];

  const [pagination, setPagination] = useState({
    pageIndex: ADMIN_TABLE_PAGE_INDEX,
    pageSize: ADMIN_TABLE_PAGE_SIZE
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name", // MUST be here or global filter will not sort by rankingValue
      desc: false
    }
  ]);

  const table = useReactTable({
    data: languages,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter //define as a filter function that can be used in column definitions
    },
    state: {
      pagination,
      globalFilter,
      sorting
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
    onPaginationChange: setPagination
  });

  return (
    <>
      {userHasRoutePermission(user, {
        resource: crud.routes.new,
        scope: "any"
      }) ? (
        <BackendPageTitle title={humanize(crud.plural)}>
          <Button
            type="button"
            text={`New ${humanize(crud.singular)}`}
            to={crud.routes.new}
          />
        </BackendPageTitle>
      ) : (
        <BackendPageTitle title={humanize(crud.plural)} />
      )}

      <BackendContentContainer>
        <TableBar>
          <TableSearchInput
            value={globalFilter ?? ""}
            onChange={(value: string | number) =>
              setGlobalFilter(String(value))
            }
            placeholder={`Search ${crud.plural}...`}
          />
          <TableFilterDropdown />
        </TableBar>

        <TanstackTable.Table table={table}>
          <TanstackTable.THead />
          <TanstackTable.TBody />
        </TanstackTable.Table>
      </BackendContentContainer>

      <TableFooter table={table} />
    </>
  );
}
