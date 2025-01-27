/**
 * Merges two union types into single a union without duplicates.
 *
 * @example MergeUnion<ModelPermission["scope"] | RoutePermission["scope"]>
 */
export type MergeUnion<T> = { [K in unknown & keyof T]: T[K] };
