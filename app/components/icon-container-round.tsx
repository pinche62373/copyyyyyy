import type React from "react";
import { cn } from "#app/utils/lib/cn";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const IconContainerRound = ({ children, className, ...rest }: Props) => {
  return (
    <div
      className={cn(
        "inline-flex size-[38px] items-center justify-center gap-x-2 rounded-full border border-transparent",
        "focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        "text-gray-500 hover:bg-gray-100  focus:bg-gray-100",
        "dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
