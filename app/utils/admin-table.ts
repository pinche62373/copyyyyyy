import { tableCellActions } from "#app/components/tanstack-table/cell-types/actions";
import { useUser, userHasRoutePermission } from "#app/utils/user";

type TableActionsResult = Parameters<typeof tableCellActions>[0]["actions"];

interface TableActionsFunctionArgs {
  user: ReturnType<typeof useUser>;
  route: string;
  actions: TableActionsResult;
}

/**
 * Returns an object with allowed admin table cell actions
 * but only if user has access to the route. Will change
 * passed value to `false` if user does not have access.
 *
 * TODO : change to model permission (because delete does not have a route)?
 */
export const userTableCellActions = ({
  user,
  route,
  actions
}: TableActionsFunctionArgs): TableActionsResult => {
  const result: TableActionsResult = {};

  Object.keys(actions).forEach((action) => {
    // ignore action set to false
    if (actions[action as keyof TableActionsResult] === false) {
      return;
    }

    // check user access to determine action boolean
    if (
      userHasRoutePermission(user, {
        resource: `${route}/${action}`,
        scope: "any"
      })
    ) {
      result[action as keyof TableActionsResult] = true;

      return;
    }

    result[action as keyof TableActionsResult] = false;
  });

  return result;
};
