import { cn } from "#app/utils/misc";

interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * Used on the Preline site as content container per "logical section", smaller max-w for e.g. testimonials
 */
export const FrontendContentContainer = ({
  className,
  children,
  ...rest
}: Props) => {
  return (
    <div className="max-w-[82rem] basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8 bg-indigo-200 flex flex-wrap md:justify-start md:flex-nowrap z-50 dark:bg-neutral-800">
      <div className={cn("bg-white dark:bg-neutral-800", className)} {...rest}>
        {children}
      </div>
    </div>
  );
};
