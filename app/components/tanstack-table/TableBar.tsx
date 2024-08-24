import { PropsWithChildren } from "react";
import { useHydrated } from "remix-utils/use-hydrated";

import { cn } from "#app/utils/lib/cn";
interface IProps {
  className?: string;
}

export const TableBar = ({
  className,
  children,
  ...rest
}: PropsWithChildren<IProps>) => {
  const isHydrated = useHydrated();

  return (
    <>
      {isHydrated ? (
        <div
          className={cn(
            "px-2 grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-5",
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      ) : null}
    </>
  );
};
