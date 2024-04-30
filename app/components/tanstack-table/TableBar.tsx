import classNames from "classnames";
import { PropsWithChildren } from "react";

interface IProps {
  className?: string;
}

export const TableBar = ({
  className,
  children,
  ...rest
}: PropsWithChildren<IProps>) => {
  return (
    <div
      className={classNames(
        "px-2 grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-5",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default TableBar;
