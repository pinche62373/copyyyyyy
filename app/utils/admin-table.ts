import isEmpty from "lodash.isempty";

import { tableCellActions } from "#app/components/tanstack-table/cell-types/actions";
import { useUser, userHasRoutePermission } from "#app/utils/user";

/**
 * Returns an object with allowed admin table cell actions (if user has access to the route)
 */
type TableActions = "edit" | "delete";

type TableActionsResult = Parameters<typeof tableCellActions>[0]["actions"];

interface TableActionsFunctionArgs {
  user: ReturnType<typeof useUser>;
  route: string;
  actions: TableActions | TableActions[];
}

export const userTableCellActions = ({
  user,
  route,
  actions,
}: TableActionsFunctionArgs): TableActionsResult | undefined => {
  actions = Array.isArray(actions) ? actions : [actions];

  const result: TableActionsResult = {};

  actions.forEach((action) => {
    if (
      userHasRoutePermission(user, {
        resource: `${route}/${action}`,
        scope: "any",
      })
    ) {
      result[action] = true;
    }
  });

  if (isEmpty(result)) {
    return undefined;
  }

  return result;
};
