import { cn } from "#app/utils/lib/cn";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const BackendContentContainer = ({ className, children, ...rest }: Props) => {
  return (
    <div className="relative overflow-visible">
      <div
        className={cn(
          "bg-white border border-stone-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};
