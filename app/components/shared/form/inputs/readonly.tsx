import { cn } from "#app/utils/lib/cn.ts";

interface Props {
  className?: string;
  children: React.ReactNode;
}

/**
 * Emulates a disabled text input.
 */
export const ReadOnly = ({ className, children }: Props) => {
  return (
    <div
      className={cn(
        "block min-h-12 w-full rounded-lg border-gray-200 bg-gray-100 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-80 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600",
        className
      )}
    >
      {children}
    </div>
  );
};
