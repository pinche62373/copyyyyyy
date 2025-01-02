import { InputHTMLAttributes } from "react";
import { useId } from "react";
import { tv } from "tailwind-variants";
import { cn } from "#app/utils/lib/cn";

type Variant = "stacked" | "ifta";

const tvo = tv({
  variants: {
    container: {
      stacked: "group mb-5",
      ifta: "group mb-5",
    },
    label: {
      stacked: cn("block pl-1 mb-1.5 font-medium text-md"),
      ifta: cn(
        "block pr-10 pl-4 -mb-[1.6rem]",
        "text-[80%] font-medium z-10 relative pointer-events-none",
        "text-gray-500 group-focus-within:text-blue-600",
        "group-data-[invalid=true]:text-red-500",
      ),
    },
    input: {
      stacked: cn(
        "text-sm  text-primary-foreground",
        "block w-full rounded-md px-3 py-2.5",
        "placeholder:opacity-80 disabled:pointer-events-none disabled:opacity-50",
        "focus:border-ring focus:ring-0",
        "border border-border-foreground",
        "bg-input",
        "border-none focus:ring-0 outline-none w-full rounded-md",
        "shadow-[inset_0_0_0_1px_#d4d4d8] hover:shadow-[inset_0_0_0_1px_#a1a1aa] group-focus-within:shadow-[inset_0_0_0_2px_#3b82f6_!important]",
        "placeholder:text-[#dfdfdf] group-focus-within:placeholder:text-opacity-0",
      ),
      ifta: cn(
        "text-sm",
        "pt-[1.85rem] pr-2 pl-4 pb-[0.71rem]",
        "border-none focus:ring-0 outline-none w-full rounded-md",
        "shadow-[inset_0_0_0_1px_#d4d4d8] hover:shadow-[inset_0_0_0_1px_#a1a1aa] group-focus-within:shadow-[inset_0_0_0_2px_#3b82f6_!important]",
        "group-data-[invalid=true]:shadow-[inset_0_0_0_2px_red_!important]",
        "bg-input",
        "placeholder:text-[#dfdfdf] group-focus-within:placeholder:text-opacity-0",
      ),
    },
    fieldError: {
      stacked: "block pt-1 text-[90%] text-red-500 ml-1",
      ifta: "pt-1 text-[90%] text-red-500 ml-3",
    },
  },
});

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  variant?: Variant;
  className?: string;
  error: string | undefined;
}

export function Input({
  label,
  variant = "stacked",
  className,
  error,
  ...rest
}: InputProps) {
  const id = useId();

  return (
    <div
      className={cn(tvo({ container: variant }), className)}
      data-invalid={error && true}
    >
      <label
        id={`label${id}`}
        htmlFor={`input${id}`}
        className={cn(tvo({ label: variant }), className)}
      >
        {label}
      </label>

      <input
        id={`input${id}`}
        aria-labelledby={`label${id}`}
        aria-invalid={error ? true : undefined}
        data-invalid={error && true}
        className={cn(tvo({ input: variant }), className)}
        {...rest}
      />

      {!!error && <div className={tvo({ fieldError: variant })}>{error}</div>}
    </div>
  );
}
