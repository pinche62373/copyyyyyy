import { PropsWithChildren } from "react";

import { cn } from "#app/utils/misc";

interface IProps {
  className?: string;
}

export const AdminContentCard = ({
  className,
  children,
  ...rest
}: PropsWithChildren<IProps>) => {
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

export default AdminContentCard;
