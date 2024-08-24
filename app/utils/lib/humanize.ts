/**
 * This method is "borrowed" from https://github.com/icd2k3/use-react-router-breadcrumbs.
 * as an alternative for the (bundle size of the) humanize-string package.
 */
export const humanize = (str: string): string =>
  str
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[-_\s]+/g, " ")
    .replace(/^[a-z]/, (m) => m.toUpperCase());
