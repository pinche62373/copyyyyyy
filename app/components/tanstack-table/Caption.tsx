import type React from "react";
import { cn } from "#app/utils/lib/cn.ts";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Caption = ({ className, children }: Props) => {
  return (
    <caption
      className={cn(
        "bg-white p-5 text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white",
        className,
      )}
    >
      {children}
    </caption>
  );
};
