import { useLoaderData } from "@remix-run/react";

// Fix for deprecated SerializeFrom: https://github.com/remix-run/remix/pull/10173

export type SerializeFrom<T> = ReturnType<typeof useLoaderData<T>>;
