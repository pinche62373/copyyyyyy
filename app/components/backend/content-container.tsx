import { cn } from "#app/utils/lib/cn";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const BackendContentContainer = ({
  className,
  children,
  ...rest
}: Props) => {
  return (
    <div className="relative overflow-visible">
      <div
        className={cn(
          "rounded-sm border border-stone-200 bg-foreground dark:border-gray-800",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};
