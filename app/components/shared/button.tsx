import { Link } from "react-router";
import React from "react";
import { tv } from "tailwind-variants";
import { cn } from "#app/utils/lib/cn";

type BaseProps = {
  text: string;
  disabled?: boolean;
  secondary?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler;
};

type ButtonProps = {
  type: "submit" | "reset" | "button";
  formId?: string;
  as?: never;
  to?: string;
};

type DivProps = {
  type?: never;
  formId?: never;
  as: "div";
  to?: never;
};

type Props = (BaseProps & ButtonProps) | (BaseProps & DivProps);

export function Button({
  text,
  as,
  type,
  to,
  formId,
  secondary,
  disabled,
  className,
  ...rest
}: Props) {
  const tvButton = tv({
    base: cn(
      "w-full",
      "inline-flex items-center justify-center whitespace-nowrap rounded-md",
      "px-3 py-1.5 text-start align-middle text-sm font-medium",
      "focus:outline-none focus:ring-0 disabled:pointer-events-none disabled:opacity-50",
    ),
    variants: {
      role: {
        primary: cn(
          "text-white",
          "border border-border-foreground dark:border-none",
          "bg-[#0078d4] hover:bg-[#0065b3] focus:bg-[#0065b3]",
          "dark:text-neutral-100",
          "dark:bg-[#4361ee]/90 dark:hover:bg-[#4361ee]/80 dark:focus:bg-[#4361ee]/80",
        ),
        secondary: cn(
          "text-gray-800",
          "border border-border-foreground dark:border-none",
          "bg-[#f6f8fa] hover:bg-[#eff2f5] focus:bg-[#eff2f5]",
          "dark:text-neutral-100",
          "dark:bg-[#3b3f5c]/60 dark:hover:bg-[#3b3f5c]/75 dark:focus:bg-[#3b3f5c]/75",
        ),
      },
    },
  });

  const buttonClass = secondary
    ? tvButton({ role: "secondary" })
    : tvButton({ role: "primary" });

  return (
    <>
      {/* Div looking like a Button */}
      {as === "div" && (
        <div
          className={cn(
            buttonClass,
            disabled && "opacity-50 pointer-events-none cursor-not-allowed",
            className,
          )}
        >
          {text}
        </div>
      )}

      {/* Link with a button */}
      {to && !as && (
        <Link to={to} tabIndex={-1}>
          <div className={disabled ? "cursor-not-allowed" : undefined}>
            <button
              type={type}
              form={formId}
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
      {!to && !as && (
        <div className={disabled ? "cursor-not-allowed" : undefined}>
          <button
            type={type}
            form={formId}
            className={cn(buttonClass, className)}
            disabled={disabled}
            {...rest}
          >
            {text}
          </button>
        </div>
      )}
    </>
  );
}
