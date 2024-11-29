import React from "react";
import { cn } from "#app/utils/lib/cn";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const BackendPanel = ({ className, children, ...rest }: Props) => {
  return (
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
  );
};

interface RowProps extends Props {
  last?: boolean;
}

const Row = ({ className, children, last, ...rest }: RowProps) => {
  return (
    <div className="clear-both">
      <div
        className={cn("overflow-y-auto", last ? "mb-0" : "mb-5", className)}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};

const Left = ({ className, children, ...rest }: Props) => {
  return (
    <div className={cn("float-left", className)} {...rest}>
      <div className="flex">{children}</div>
    </div>
  );
};

const Right = ({ className, children, ...rest }: Props) => {
  return (
    <div className={cn("float-right", className)} {...rest}>
      <div className="flex">{children}</div>
    </div>
  );
};

BackendPanel.Row = Row;
BackendPanel.Left = Left;
BackendPanel.Right = Right;

export { BackendPanel };
