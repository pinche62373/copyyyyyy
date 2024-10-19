import { cn } from "#app/utils/lib/cn";

interface PropTypes {
  label: string;
  className?: string;
}

export const Label = ({ label, className }: PropTypes) => {
  return (
    <label
      htmlFor="null"
      className={cn(
        "inline-block text-sm font-normal text-gray-500 sm:mt-2.5 dark:text-neutral-500",
        className
      )}
    >
      {label}
    </label>
  );
};
