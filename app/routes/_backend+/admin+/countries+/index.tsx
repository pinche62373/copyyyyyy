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
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { z } from "zod";
import { BackendPanel } from "#app/components/backend/panel.tsx";
import { BackendTitle } from "#app/components/backend/title.tsx";
import { Flex } from "#app/components/flex.tsx";
import type { BreadcrumbHandle } from "#app/components/shared/breadcrumb";
import TanstackTable from "#app/components/tanstack-table";
import { TableFooter } from "#app/components/tanstack-table/TableFooter";
import { TableSearch } from "#app/components/tanstack-table/TableSearch";
import { TableButtonDelete } from "#app/components/tanstack-table/cells/table-button-delete.tsx";
import { TableButtonEdit } from "#app/components/tanstack-table/cells/table-button-edit.tsx";
import { TableDate } from "#app/components/tanstack-table/cells/table-date.tsx";
import { TableIndex } from "#app/components/tanstack-table/cells/table-index.tsx";
import { TableLink } from "#app/components/tanstack-table/cells/table-link.tsx";
import { fuzzyFilter } from "#app/components/tanstack-table/filters/fuzzy-filter";
import { fuzzySort } from "#app/components/tanstack-table/sorts/fuzzy";
import { LinkButton } from "#app/components/ui/link-button.tsx";
import { getCountries } from "#app/models/country.server";
import { getAdminCrud } from "#app/utils/admin-crud";
import {
  ADMIN_TABLE_PAGE_INDEX,
  ADMIN_TABLE_PAGE_SIZE,
} from "#app/utils/constants";
import { getUserTableCellActions } from "#app/utils/get-user-table-cell-actions";
import { humanize } from "#app/utils/lib/humanize";
import { requireRoutePermission } from "#app/utils/permissions.server";
import { useUser, userHasRoutePermission } from "#app/utils/user";
import {
  CountrySchemaAdminTable,
  CountrySchemaDelete,
} from "#app/validations/country-schema";

const { countryCrud: crud } = getAdminCrud();

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

  const countries = await getCountries();

  return {
    countries,
  };
};

export default function Component() {
  const { countries } = useLoaderData<typeof loader>();

  const user = useUser();

  const userHasCreatePermission = userHasRoutePermission(user, {
    resource: crud.routes.new,
    scope: "any",
  });

  const columnHelper =
    createColumnHelper<z.infer<typeof CountrySchemaAdminTable>>();

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
      cell: ({ row, table }) => <TableIndex row={row} table={table} />,
    }),
    columnHelper.accessor("name", {
      header: "Name",
      filterFn: "fuzzy", //using our custom fuzzy filter function
      sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
      cell: ({ row }) => (
        <TableLink
          label={row.original.name}
          to={`${crud.routes.index}/${row.original.id}`}
        />
      ),
    }),
    columnHelper.accessor("region.name", {
      header: "Region",
      enableGlobalFilter: true,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      enableGlobalFilter: false,
      cell: (info) => <TableDate timestamp={info.getValue()} />,
    }),
    columnHelper.accessor("updatedAt", {
      header: "Updated",
      enableGlobalFilter: false,
      cell: (info) => <TableDate timestamp={info.getValue()} />,
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
            cell: (info) => (
              <>
                <TableButtonEdit info={info} crud={crud} />
                <TableButtonDelete
                  info={info}
                  crud={crud}
                  schema={CountrySchemaDelete}
                />
              </>
            ),
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

  const TableSearchComponent = () => (
    <Flex.Start>
      <TableSearch
        value={globalFilter ?? ""}
        onChange={(value: string | number) => setGlobalFilter(String(value))}
        placeholder={`Search ${crud.plural}...`}
      />
    </Flex.Start>
  );

  const LinkButtonComponent = () => (
    <Flex.End className="mb-5 sm:mb-0">
      <LinkButton
        text={`New ${humanize(crud.singular)}`}
        to={crud.routes.new}
      />
    </Flex.End>
  );

  return (
    <>
      <BackendPanel>
        <BackendTitle text={humanize(crud.plural)} foreground />

        <Flex className="mobile">
          {userHasCreatePermission && <LinkButtonComponent />}
          <TableSearchComponent />
        </Flex>

        <Flex className="desktop">
          <TableSearchComponent />
          {userHasCreatePermission && <LinkButtonComponent />}
        </Flex>

        <TanstackTable.Table table={table} className="mt-5">
          <TanstackTable.THead />
          <TanstackTable.TBody />
        </TanstackTable.Table>

        <TableFooter table={table} />
      </BackendPanel>
    </>
  );
}
