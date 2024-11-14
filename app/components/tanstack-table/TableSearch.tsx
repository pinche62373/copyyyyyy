import { DebouncedInput } from "#app/components/debounced-input";
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
        <svg
          className="size-4 shrink-0 text-secondary-foreground"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </div>

      <DebouncedInput
        id="table-search-input"
        {...props}
        onChange={onChange}
        className={cn(
          "mb-1 block w-full rounded-lg border border-border-foreground px-3 py-[7px] ps-10 disabled:pointer-events-none disabled:opacity-50",
          "placeholder:opacity-90",
          "focus:border-ring focus:ring-0",
          "bg-input text-sm text-secondary-foreground"
        )}
      />
    </div>
  );
};
