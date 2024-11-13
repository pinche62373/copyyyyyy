import { cn } from "#app/utils/lib/cn";

interface Args {
  title: string;
  count: number;
  icon: JSX.Element;
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
        "rounded-sm border border-border-foreground bg-foreground p-4 shadow-sm sm:p-5 dark:border-none",
        className
      )}
      {...rest}
    >
      <div className="sm:flex sm:gap-x-3">
        {/* Asterix class applies to svg child element */}
        <span className="mb-2 size-6 shrink-0 text-secondary-foreground *:size-6 sm:order-2 sm:mb-0">
          {icon}
        </span>

        <div className="grow space-y-1 sm:order-1">
          <h2 className="text-sm text-secondary-foreground sm:mb-3">
            {title}
          </h2>
          <p className="text-lg font-medium text-primary-foreground md:text-xl">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
}
