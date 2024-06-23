import { NavLink } from "@remix-run/react";

interface PropTypes {
  id: string;
  name: string;
  target: string;
}

export const getCellLink = ({ id, name, target }: PropTypes) => {
  id = encodeURIComponent(id) // so we can use both cuids and strings

  return (
    <NavLink
      to={`${target}/${id}`}
      className="block text-sm font-medium text-gray-800 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 dark:text-white dark:hover:text-white/70 dark:focus:text-white/70"
    >
      {name}
    </NavLink>
  );
};
