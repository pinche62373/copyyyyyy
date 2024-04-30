import classNames from "classnames";
import { PropsWithChildren } from "react";

interface IProps {
  className?: string;
}

export const AdminContentCard = ({
  className,
  children,
  ...rest
}: PropsWithChildren<IProps>) => {
  return (
    <div className="relative overflow-x-auto">
      <div
        className={classNames(
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
