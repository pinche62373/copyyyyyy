import type React from "react";
import { cn } from "#app/utils/lib/cn";

interface Props {
  className?: string;
  children: React.ReactNode;
}

/**
 * Responsive helper component that generates columns on mobile, rows on desktop.
 *
 * Use Flex.Start to insert left floating child elements.
 *
 * Use Flex.End to insert right floating child elements.
 */
const Flex = ({ className, children, ...rest }: Props) => {
  return (
    <div
      className={cn("flex flex-col sm:flex-row w-full", className)}
      {...rest}
    >
      {children}
    </div>
  );
};

const Start = ({ className, children, ...rest }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        "sm:flex-row sm:grow sm:float-start sm:justify-start sm:gap-2",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

const End = ({ className, children, ...rest }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        "sm:flex-row sm:grow sm:float-end sm:justify-end sm:gap-2",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

Flex.Start = Start;
Flex.End = End;

export { Flex };
