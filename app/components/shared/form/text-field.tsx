import React from "react";
import {
  FieldError as AriaFieldError,
  Input as AriaInput,
  Label as AriaLabel,
  TextField as AriaTextField,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { cn } from "#app/utils/lib/cn";

type Variant = "stacked" | "ifta";

let activeVariant: Variant = "stacked";

const tvo = tv({
  variants: {
    textField: {
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
        "block w-full rounded-md px-3 py-2.5 text-sm",
        "placeholder:opacity-80 disabled:pointer-events-none disabled:opacity-50",
        "focus:border-ring focus:ring-0",
        "border border-border-foreground",
        "bg-input text-primary-foreground",
        "border-none focus:ring-0 outline-none w-full rounded-md",
        "shadow-[inset_0_0_0_1px_#d4d4d8] hover:shadow-[inset_0_0_0_1px_#a1a1aa] group-focus-within:shadow-[inset_0_0_0_2px_#3b82f6_!important]",
        "placeholder:text-[#dfdfdf] group-focus-within:placeholder:text-opacity-0",
      ),
      ifta: cn(
        "pt-[1.85rem] pr-2 pl-4 pb-[0.71rem]",
        "border-none focus:ring-0 outline-none w-full rounded-md",
        "shadow-[inset_0_0_0_1px_#d4d4d8] hover:shadow-[inset_0_0_0_1px_#a1a1aa] group-focus-within:shadow-[inset_0_0_0_2px_#3b82f6_!important]",
        "group-data-[invalid=true]:shadow-[inset_0_0_0_2px_red_!important]",
        "placeholder:text-[#dfdfdf] group-focus-within:placeholder:text-opacity-0",
      ),
    },
    fieldError: {
      stacked: "block pt-1 text-sm text-red-500 ml-2",
      ifta: "pt-1 text-sm text-red-500 ml-2",
    },
  },
});

interface TextFieldProps {
  isInvalid: boolean; // required so invalid: classes are always set
  className?: string;
  variant?: Variant;
  children: React.ReactNode;
}

const TextField = ({
  isInvalid,
  className,
  variant = "stacked",
  children,
  ...rest
}: TextFieldProps) => {
  activeVariant = variant; // set global variable

  return (
    <AriaTextField
      defaultValue=""
      isInvalid={isInvalid}
      validationBehavior="aria" // Let React Hook Form handle validation instead of the browser.
      className={cn(tvo({ textField: activeVariant }), className)}
      {...rest}
    >
      {children}
    </AriaTextField>
  );
};

interface LabelProps {
  className?: string;
  children: React.ReactNode;
}

const Label = ({ className, children, ...rest }: LabelProps) => {
  return (
    <AriaLabel
      className={cn(tvo({ label: activeVariant }), className)}
      {...rest}
    >
      {children}
    </AriaLabel>
  );
};

interface InputProps {
  type?: string;
  className?: string;
}

const Input = ({ type, className }: InputProps) => {
  return (
    <AriaInput
      type={type}
      className={cn(tvo({ input: activeVariant }), className)}
    />
  );
};

interface FieldErrorProps {
  children: React.ReactNode;
  className?: string;
}

const FieldError = ({ className, children, ...rest }: FieldErrorProps) => {
  return (
    <AriaFieldError
      className={cn(tvo({ fieldError: activeVariant }), className)}
      {...rest}
    >
      {children}
    </AriaFieldError>
  );
};

// Start using this again when switching to React 19
TextField.Label = Label;
TextField.Input = Input;
TextField.FieldError = FieldError;

export { TextField };
