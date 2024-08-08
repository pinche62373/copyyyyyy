/**
 * Splat route to fix 404 FOUC/hydration error
 *
 * @link {@see https://github.com/remix-run/remix/discussions/5186#discussioncomment-4748778}
 */

import { json } from "@remix-run/node";

/**
 * Create a response receiving a JSON object with the status code 404.
 * @example
 * export async function loader({ request, params }: LoaderArgs) {
 *   let user = await getUser(request);
 *   if (!db.exists(params.id)) throw notFound<BoundaryData>({ user });
 * }
 */
function notFound<Data = unknown>(
  data: Data,
  init?: Omit<ResponseInit, "status">,
) {
  return json<Data>(data, { ...init, status: 404 });
}

export function loader() {
  throw notFound(null);
}

export default function NotFound() {
  return null;
}
