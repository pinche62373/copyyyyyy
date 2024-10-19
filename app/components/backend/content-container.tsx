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
          "bg-white border border-stone-200 rounded-md shadow-sm dark:border-gray-800 dark:bg-gray-900",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};
