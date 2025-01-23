import React from "react";
import { cn } from "#app/utils/lib/cn";

interface Args {
  title: string;
  count: number;
  icon: React.JSX.Element;
  className?: string;
}

export function DashboardCounterCard({
  title,
  count,
  icon,
  className,
  ...rest
}: Args) {
  return (
    <div
      className={cn(
        "bg-foreground rounded-sm shadow-sm",
        "border border-border-foreground dark:border-none",
        "p-3 sm:p-5 ",
        className,
      )}
      {...rest}
    >
      <div className="flex gap-x-3">
        <span
          className={cn(
            "shrink-0 order-2",
            "text-secondary-foreground mb-0",
            "*:size-5 sm:*:size-6", // these asterisk classes are applied to the SVG child element
          )}
        >
          {icon}
        </span>

        <div className="grow space-y-1 sm:order-1">
          <h2 className="text-sm text-secondary-foreground mb-2 sm:mb-3">
            {title}
          </h2>
          <p className="text-lg font-medium text-primary-foreground md:text-xl">
            {count}
          </p>
        </div>
      </div>

      {/* End of Container */}
    </div>
  );
}
