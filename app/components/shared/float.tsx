import React from "react";
import { cn } from "#app/utils/lib/cn";

type Direction = "end" | "start";

interface FloatProps {
  direction: Direction;
  className?: string;
  children: React.ReactNode;
}

export const Float = ({
  direction,
  className,
  children,
  ...rest
}: FloatProps) => {
  if (direction === "end") {
    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-end sm:justify-end sm:mr-2",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  // start
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};
