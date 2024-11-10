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
        "block min-h-[38px] w-full rounded-lg px-3 pt-2 text-sm",
        "font-semibold text-secondary-foreground",
        "border border-border-foreground bg-transparent",
        className
      )}
    >
      {children}
    </div>
  );
};
