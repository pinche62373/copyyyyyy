import type React from "react";
import { cn } from "#app/utils/lib/cn";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const BackendPanel = ({ className, children, ...rest }: Props) => {
  return (
    <>
      <div className="relative overflow-visible">
        <div
          className={cn(
            "mb-6 rounded-md border border-border-foreground bg-foreground px-5 py-5 shadow-sm dark:border-none",
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </div>
    </>
  );
};
