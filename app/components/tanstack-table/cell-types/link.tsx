import { NavLink } from "@remix-run/react";

import { cn } from "#app/utils/lib/cn";

interface PropTypes {
  id: string;
  name: string;
  target: string;
}

export const tableCellLink = ({ id, name, target }: PropTypes) => {
  id = encodeURIComponent(id); // so we can use both cuids and strings

  return (
    <NavLink
      to={`${target}/${id}`}
      className={cn(
        "block text-sm hover:underline focus:outline-none",
        "text-gray-800 hover:text-indigo-600 focus:text-indigo-600 ",
        "dark:text-blue-600 dark:hover:text-blue-600 dark:focus:text-blue-600"
      )}
    >
      {name}
    </NavLink>
  );
};
