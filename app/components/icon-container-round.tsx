import { cn } from "#app/utils/misc";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const IconContainerRound = ({ children, className, ...rest }: Props) => {
  return (
    <div
      className={cn(
        "size-[38px] inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
