import { useUser, userHasRoutePermission } from "#app/utils/user";

interface ActionsResult {
  edit?: boolean;
  delete?: boolean;
}

interface TableActionsFunctionArgs {
  user: ReturnType<typeof useUser>;
  route: string;
  actions: ActionsResult;
}

/**
 * Returns an object with allowed admin table cell actions
 * but only if user has access to the route. Will change
 * passed value to `false` if user does not have access.
 *
 * TODO : change to model permission (because delete does not have a route)?
 */
export const getUserTableCellActions = ({
  user,
  route,
  actions,
}: TableActionsFunctionArgs): ActionsResult | undefined => {
  const result: ActionsResult = {};

  Object.keys(actions).forEach((action) => {
    // ignore actions set to false
    if (actions[action as keyof ActionsResult] === false) {
      return;
    }

    // only set result if user has access to the action route
    if (
      userHasRoutePermission(user, {
        resource: `${route}/${action}`,
        scope: "any",
      })
    ) {
      result[action as keyof ActionsResult] = true;

      return;
    }
  });

  if (Object.keys(result).length === 0) {
    return undefined;
  }

  return result;
};
