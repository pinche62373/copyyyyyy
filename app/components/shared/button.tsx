import { Link } from "@remix-run/react";
import type { ButtonHTMLAttributes } from "react";
import { tv } from "tailwind-variants";

import { cn } from "#app/utils/lib/cn";

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
  const tvButton = tv({
    base: "inline-flex items-center justify-center whitespace-nowrap rounded-lg border px-3 py-1.5 text-start align-middle font-medium shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
    variants: {
      role: {
        primary:
          "gap-x-2 border-blue-800 bg-blue-800 text-sm text-white hover:bg-blue-700 focus:ring-blue-700 dark:hover:border-blue-700 dark:focus:ring-blue-700",
        secondary:
          "border-gray-200 bg-white text-sm text-gray-800 hover:bg-gray-50 focus:bg-gray-50 focus:ring-gray-50 dark:border-border-foreground dark:bg-input dark:text-secondary-foreground dark:hover:bg-input dark:hover:text-primary-foreground dark:focus:bg-neutral-700 dark:focus:ring-neutral-800"
      }
    }
  });

  const buttonClass = secondary
    ? tvButton({ role: "secondary" })
    : tvButton({ role: "primary" });

  return (
    <>
      {/* Link disguised as button */}
      {to && (
        <Link to={to} tabIndex={-1}>
          <button type={type} className={cn(buttonClass, className)} {...rest}>
            {text}
          </button>
        </Link>
      )}

      {/* Real button  */}
      {!to && (
        <button type={type} className={cn(buttonClass, className)} {...rest}>
          {text}
        </button>
      )}
    </>
  );
}
