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
        "p-4 sm:p-5 bg-white border border-stone-200 rounded-xl shadow-sm dark:bg-gray-900 dark:border-gray-950",
        className
      )}
      {...rest}
    >
      <div className="sm:flex sm:gap-x-3">
        {/* Asterix class applies to svg child element */}
        <span className="mb-2 size-6 shrink-0 text-stone-400 *:size-6 sm:order-2 sm:mb-0 dark:text-neutral-600">
          {icon}
        </span>

        <div className="grow space-y-1 sm:order-1">
          <h2 className="text-sm text-stone-500 sm:mb-3 dark:text-neutral-400">
            {title}
          </h2>
          <p className="text-lg font-semibold text-stone-800 md:text-xl dark:text-neutral-200">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
}
