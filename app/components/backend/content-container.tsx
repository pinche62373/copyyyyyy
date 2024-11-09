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
          "rounded-md border border-border bg-foreground dark:border-none",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};
