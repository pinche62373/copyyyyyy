import { Link } from "@remix-run/react";
import type { ButtonHTMLAttributes } from "react";
import { tv } from "tailwind-variants";

import { cn } from "#app/utils/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type: "submit" | "reset" | "button";
  text: string;
  to?: string;
  disabled?: boolean;
  secondary?: boolean;
  className?: string;
}

export function Button({
  text,
  type,
  to,
  secondary,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const tvButton = tv({
    base: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md",
      "px-3 py-1.5 text-start align-middle text-sm font-medium",
      "focus:outline-none focus:ring-0 disabled:pointer-events-none disabled:opacity-50"
    ),
    variants: {
      role: {
        primary: cn(
          "text-white",
          "bg-[#4361ee] hover:bg-[#3c57d6]",
          "dark:text-neutral-100",
          "dark:bg-[#4361ee]/90 dark:hover:bg-[#4361ee]/80",
        ),
        secondary: cn(
          "border border-border-foreground dark:border-none",
          "text-gray-800",
          "bg-white hover:bg-gray-100",
          "dark:text-neutral-100",
          "dark:bg-[#3b3f5c]/60 dark:hover:bg-[#3b3f5c]/75",
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
          <div className={disabled ? "cursor-not-allowed" : undefined}>
            <button
              type={type}
              className={cn(buttonClass, className)}
              disabled={disabled}
              {...rest}
            >
              {text}
            </button>
          </div>
        </Link>
      )}

      {/* Real button  */}
      {!to && (
        <div className={disabled ? "cursor-not-allowed" : undefined}>
          <button type={type} className={cn(buttonClass, className)} disabled={disabled} {...rest}>
            {text}
          </button>
        </div>
      )}
    </>
  );
}
