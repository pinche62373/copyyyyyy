import type { HTMLInputTypeAttribute } from "react";
import { type InputHTMLAttributes, useId, useState } from "react";
import { tv } from "tailwind-variants";
import { Icon } from "#app/components/ui/icon.tsx";
import { cn } from "#app/utils/lib/cn";

type Variant = "stacked" | "ifta";

const tvo = tv({
  variants: {
    container: {
      stacked: "group mb-5",
      ifta: "group relative mb-5",
    },
    label: {
      stacked: cn("block pl-1 mb-1.5 font-medium text-md"),
      ifta: cn(
        "absolute text-sm text-secondary-foreground select-none",
        "pl-[9px] top-6", // alignment
        "duration-300 transform -translate-y-4 scale-75 z-10 origin-[0] start-2.5",
        "peer-focus:text-blue-600 peer-focus:dark:text-blue-500",
        "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0",
        "peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto",
        "group-data-[invalid=true]:text-red-500 group-data-[invalid=true]:peer-focus:text-red-500",
      ),
    },
    input: {
      stacked: cn(
        "text-sm text-primary-foreground",
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
        "peer block relative rounded-sm px-2.5 pb-2.5 pt-8 w-full appearance-none focus:outline-none focus:ring-0",
        "text-sm text-primary-foreground",
        "pl-[16px] focus:pl-[13px]", // alignment
        "bg-input hover:bg-input-hover",
        "border-1 border-border-foreground",
        "focus:border-l-4 focus:border-border-foreground focus:border-l-blue-500",
        "group-data-[invalid=true]:border-l-4 group-data-[invalid=true]:border-l-red-500",
        "group-data-[invalid=true]:pl-[13px]",
        "pr-11", // leave room for the checkmark
      ),
    },
    fieldError: {
      stacked: "block pt-1 text-[90%] text-red-500 ml-1",
      ifta: cn("pt-1.5 text-[85%] text-red-500"),
    },
  },
});

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: HTMLInputTypeAttribute;
  label: string;
  optional?: boolean;
  checkmark?: boolean;
  variant?: Variant;
  error: string | undefined;
  className?: string;
}

export function Input({
  type = "text",
  label,
  optional,
  checkmark,
  variant = "stacked",
  error,
  className,
  ...rest
}: InputProps) {
  const [initialType] = useState(type);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const id = useId();

  return (
    <div
      className={cn(tvo({ container: variant }), className)}
      data-invalid={error && true}
    >
      <div className="flex">
        {/* INPUT FIELD */}
        <input
          type={showPassword ? "text" : initialType}
          id={`input${id}`}
          aria-labelledby={`label${id}`}
          aria-invalid={error ? true : undefined}
          data-invalid={error && true}
          autoCorrect="off"
          spellCheck="false"
          className={cn(tvo({ input: variant }), className)}
          placeholder=" "
          {...rest}
        />

        {/* SUCCESS CHECKMARK */}
        {checkmark && (
          <span className="absolute top-5 right-4">
            <Icon name="checkmark" className="text-2xl text-green-600" />
          </span>
        )}

        {/* PASSWORD ICON */}
        {type === "password" && (
          <span
            className="absolute top-5 right-4 hover:cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            <Icon
              name={showPassword ? "eye-off" : "eye"}
              className="text-2xl"
            />
          </span>
        )}

        {/* FLOATING LABEL */}
        <label
          id={`label${id}`}
          htmlFor={`input${id}`}
          className={cn(tvo({ label: variant }), className)}
        >
          {label}
          {optional && <span className="italic opacity-50"> (optional)</span>}
        </label>
      </div>

      {/* ERROR MESSAGE */}
      {!!error && <div className={tvo({ fieldError: variant })}>{error}</div>}
    </div>
  );
}
