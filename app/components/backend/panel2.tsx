import React from "react";
import { cn } from "#app/utils/lib/cn";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const BackendPanel2 = ({ className, children, ...rest }: Props) => {
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

interface RowProps extends Props {
  last?: boolean;
}

const Row = ({ className, children, last, ...rest }: RowProps) => {
  return (
    <>
      <div className={cn("grid sm:grid-cols-2")} {...rest}>
        {/* <div className="order-2 md:order-1 bg-red-300">Secondary</div>
        <div className="order-1 md:order-2 bg-green-300">Primary</div> */}
        {children}
      </div>
    </>
  );
};

const Left = ({ className, children, ...rest }: Props) => {
  return (
    <div className={cn("grow float-left", className)} {...rest}>
      <div className="sm:flex">{children}</div>
    </div>
  );
};

const Right = ({ className, children, ...rest }: Props) => {
  return (
    <div
      className={cn("grow float-end sm:justify-items-end", className)}
      {...rest}
    >
      <div className="sm:flex">{children}</div>
    </div>
  );
};

BackendPanel2.Row = Row;
BackendPanel2.Left = Left;
BackendPanel2.Right = Right;

export { BackendPanel2 };
