import React from "react";
import { NavLink } from "react-router";
import { cn } from "#app/utils/lib/cn";

interface Props {
  to: string;
  label: string;
}

/**
 * Returns a NavLink object.
 */
export const TableLink = ({ to, label }: Props) => {
  return (
    <NavLink
      to={to}
      className={cn(
        "block focus:outline-none",
        "text-accent-foreground hover:underline",
      )}
    >
      {label}
    </NavLink>
  );
};
