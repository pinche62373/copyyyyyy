import React from "react";
import { NavLink } from "react-router";
import { cn } from "#app/utils/lib/cn";

interface Props {
  to: string;
  children: React.ReactNode;
}

/**
 * Returns a NavLink object.
 */
export const TableLink = ({ to, children }: Props) => {
  return (
    <NavLink
      to={to}
      className={cn(
        "block focus:outline-none",
        "text-accent-foreground hover:underline",
      )}
    >
      {children}
    </NavLink>
  );
};
