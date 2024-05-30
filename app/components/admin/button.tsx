import { NavLink } from "@remix-run/react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "#app/utils/misc";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type: "submit" | "reset" | "button";
  text: string;
  to?: string;
  secondary?: boolean;
  className?: string;
}

export function Button({
  text,
  type,
  to,
  secondary,
  className,
  ...rest
}: ButtonProps) {
  const buttonClass = secondary
    ? "py-2 px-3 inline-flex justify-center items-center text-start bg-white border border-gray-200 text-gray-800 text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
    : "py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <>
      {to ? (
        <NavLink to={to}>
          <button type={type} className={cn(buttonClass, className)} {...rest}>
            {text}
          </button>
        </NavLink>
      ) : (
        <button type={type} className={cn(buttonClass, className)} {...rest}>
          {text}
        </button>
      )}
    </>
  );
}
