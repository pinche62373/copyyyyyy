import type { ButtonHTMLAttributes } from "react";

import { cn } from "#app/utils/misc";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  className?: string;
}

export function FormButton({ label, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "py-2 px-3 inline-flex justify-center items-center gap-x-2 text-start bg-blue-600 border border-blue-600 text-white text-sm font-medium rounded-lg shadow-sm align-middle hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500  disabled:opacity-50 disabled:pointer-events-none",
        className,
      )}
      {...props}
    >
      {label}
    </button>
  );
}
