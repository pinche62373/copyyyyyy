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
        "block focus:outline-none",
        "text-accent-foreground hover:underline",
      )}
    >
      {name}
    </NavLink>
  );
};
