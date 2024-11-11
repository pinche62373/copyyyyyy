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
    base: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md",
      "px-3 py-1.5 text-start align-middle text-sm font-medium",
      "focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
    ),
    variants: {
      role: {
        primary: cn(
          "bg-[#4361ee] text-white hover:bg-[#3c57d6]",
          "dark:bg-[#4361ee]/70 dark:text-neutral-300 dark:hover:bg-[#4361ee]/60 dark:hover:text-neutral-300/80"
        ),
        secondary: cn(
          "border border-border-foreground dark:border-none",
          "bg-white text-gray-800 hover:bg-gray-100",
          "dark:bg-[#3b3f5c] dark:text-primary-foreground",
          "dark:hover:text-primary-foreground/80 dark:hover:bg-[#3b3f5c]/70"
        )
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
