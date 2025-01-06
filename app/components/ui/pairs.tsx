import React from "react";
import { cn } from "#app/utils/lib/cn.ts";

interface Props extends React.HTMLAttributes<HTMLDListElement> {
  className?: string;
  children: React.ReactNode;
}

/**
 * Responsive Description List for key-value pairs.
 *
 * Pair produces the DL element.
 *
 * Pair.Key creates the DT element.
 *
 * Pair.Value creates the DD element.
 */
const Pairs = ({ className, children, ...rest }: Props) => {
  return (
    <dl
      className={cn(
        "grid columns-1 sm:grid-cols-[max-content_1fr]",
        "gap-2 sm:gap-5",
        className,
      )}
      {...rest}
    >
      {children}
    </dl>
  );
};

const Key = ({ className, children, ...rest }: Props) => {
  return (
    <dt
      className={cn(
        "whitespace-nowrap align-middle font-semibold text-tertiary-foreground",
        className,
      )}
      {...rest}
    >
      {children}
    </dt>
  );
};

const Value = ({ className, children, ...rest }: Props) => {
  return (
    <dd
      className={cn("col-start-1 sm:col-start-2", "mb-4 sm:mb-0", className)}
      {...rest}
    >
      {children}
    </dd>
  );
};

Pairs.Key = Key;
Pairs.Value = Value;

export { Pairs };
