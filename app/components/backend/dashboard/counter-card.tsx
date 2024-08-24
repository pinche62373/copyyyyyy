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
        "p-4 sm:p-5 bg-white border border-stone-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700",
        className,
      )}
      {...rest}
    >
      <div className="sm:flex sm:gap-x-3">
        {/* Asterix class applies to svg child element */}
        <span className="sm:order-2 mb-2 sm:mb-0 flex-shrink-0 size-6 text-stone-400 dark:text-neutral-600 *:size-6">
          {icon}
        </span>

        <div className="sm:order-1 grow space-y-1">
          <h2 className="sm:mb-3 text-sm text-stone-500 dark:text-neutral-400">
            {title}
          </h2>
          <p className="text-lg md:text-xl font-semibold text-stone-800 dark:text-neutral-200">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
}
