/**
 * Splat route to fix 404 FOUC/hydration error
 *
 * @see {@link https://github.com/remix-run/remix/discussions/5186#discussioncomment-4748778}
 */

import { data } from "react-router";

/**
 * Create a response receiving a JSON object with the status code 404.
 * @example
 * export async function loader({ request, params }: LoaderArgs) {
 *   let user = await getUser(request);
 *   if (!db.exists(params.id)) throw notFound<BoundaryData>({ user });
 * }
 */
function notFound<Data = unknown>(
  responseData: Data,
  init?: Omit<ResponseInit, "status">,
) {
  return data<Data>(responseData, { ...init, status: 404 });
}

export function loader() {
  throw notFound(null);
}

export default function NotFound() {
  return null;
}
