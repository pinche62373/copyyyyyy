import type { Row } from "@tanstack/react-table";
import { NavLink } from "react-router";
import { IconContainerRound } from "#app/components/icon-container-round";
import { Icon } from "#app/components/ui/icon.tsx";
import type { Crud } from "#app/utils/admin-crud";
import { useUser, userHasRoutePermission } from "#app/utils/user";

interface Props {
  // biome-ignore lint/suspicious/noExplicitAny: Known Tanstack issue
  row: Row<any>;
  crud: Crud;
}

/**
 * Returns a link element pointing to the /edit page for the given row.
 */
export const TableButtonEdit = ({ row, crud }: Props) => {
  const user = useUser();

  if (
    userHasRoutePermission(user, {
      resource: crud.routes.edit,
      scope: "any",
    }) === false
  ) {
    return null;
  }

  return (
    <NavLink to={`${row.original.id}/edit`} title="Edit">
      <IconContainerRound>
        <Icon name="pencil" />
      </IconContainerRound>
    </NavLink>
  );
};
