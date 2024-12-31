import React from "react";
import { cn } from "#app/utils/lib/cn";

interface FloatProps {
  className?: string;
  children: React.ReactNode;
}

const Float = ({ className, children, ...rest }: FloatProps) => {
  return (
    <div
      className={cn("flex flex-col sm:flex-row w-full", className)}
      {...rest}
    >
      {children}
    </div>
  );
};

const Left = ({ className, children, ...rest }: FloatProps) => {
  return (
    <div
      className={cn(
        "grow sm:flex sm:grow sm:float-start sm:justify-start",
        "gap-2",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

const Right = ({ className, children, ...rest }: FloatProps) => {
  return (
    <div
      className={cn(
        "grow sm:flex sm:grow sm:float-end sm:justify-end",
        "gap-2",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

Float.Left = Left;
Float.Right = Right;

export { Float };
