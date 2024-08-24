/**
 * Merge two remix headers, useful for e.g. expiring two cookies.
 */
export function mergeHeaders(
  ...headers: (ResponseInit["headers"] | null | undefined)[]
) {
  const merged = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
      merged.set(key, value);
    }
  }
  return merged;
}
