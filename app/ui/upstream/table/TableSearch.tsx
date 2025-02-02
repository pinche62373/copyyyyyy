import type React from "react";
import { DebouncedInput } from "#app/ui/upstream/debounced-input.tsx";
import { Icon } from "#app/ui/upstream/icon.tsx";
import { cn } from "#app/utils/lib/cn";

export const TableSearch = ({
  onChange,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-3.5">
        <Icon
          name="search"
          className="size-4 shrink-0 text-secondary-foreground"
        />
      </div>

      <DebouncedInput
        id="table-search-input"
        {...props}
        onChange={onChange}
        className={cn(
          "block w-full rounded-lg border border-border-foreground px-3 py-[7px] ps-10 disabled:pointer-events-none disabled:opacity-50",
          "placeholder:opacity-90",
          "focus:border-ring focus:ring-0",
          "bg-input text-sm text-secondary-foreground",
        )}
      />
    </div>
  );
};
