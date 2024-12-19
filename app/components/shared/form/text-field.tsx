import React, { forwardRef } from "react";
import {
  FieldError as AriaFieldError,
  Input as AriaInput,
  Label as AriaLabel,
  TextField as AriaTextField,
} from "react-aria-components";
import { cn } from "#app/utils/lib/cn";

interface LabelProps {
  className?: string;
  children: React.ReactNode;
}

const Label = ({ className, children, ...rest }: LabelProps) => {
  return (
    <AriaLabel
      className={cn(
        "block pr-10 pl-4 -mb-[1.6rem]",
        "text-[80%] font-medium z-10 relative pointer-events-none",
        "text-gray-500 group-focus-within:text-blue-600",
        className,
      )}
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

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, className }, ref) => {
    return (
      <AriaInput
        type={type}
        ref={ref}
        className={cn(
          "pt-[1.85rem] pr-2 pl-4 pb-[0.71rem]",
          "border-none focus:ring-0 outline-none w-full rounded-md",
          "shadow-[inset_0_0_0_1px_#d4d4d8] hover:shadow-[inset_0_0_0_1px_#a1a1aa] group-focus-within:shadow-[inset_0_0_0_2px_#3b82f6_!important]",
          "placeholder:text-[#dfdfdf] group-focus-within:placeholder:text-opacity-0",
          className,
        )}
      />
    );
  },
);

interface FieldErrorProps {
  children: React.ReactNode;
  className?: string;
}

const FieldError = ({ className, children, ...rest }: FieldErrorProps) => {
  return (
    <AriaFieldError
      className={cn("pt-1 text-sm text-red-500", className)}
      {...rest}
    >
      {children}
    </AriaFieldError>
  );
};

// ----------------------------------------------------------------------------
// As a temporary workaround we us Object.assign() to allow compound component
// with forwarded ref. Once switched to React 19 which supports ref as a prop:
// - Remove Object.assign()
// - Move this component to top of page again
// - Export as currently commented out at bottom of page
// ----------------------------------------------------------------------------
interface TextFieldProps {
  isInvalid: boolean; // required so invalid: classes are always set
  className?: string;
  children: React.ReactNode;
}

const TextField = Object.assign(
  forwardRef<HTMLInputElement, TextFieldProps>(
    ({ isInvalid, className, children, ...rest }, ref) => {
      return (
        <AriaTextField
          ref={ref}
          isInvalid={isInvalid}
          validationBehavior="aria" // Let React Hook Form handle validation instead of the browser.
          className={cn("group", className)}
          {...rest}
        >
          {children}
        </AriaTextField>
      );
    },
  ),
  {
    Label: Label,
    Input: Input,
    FieldError: FieldError,
  },
);

// Start using this again when switching to React 19
// MyTextField.Label = Label;
// MyTextField.Input = Input;
// MyTextField.FieldError = FieldError;

export { TextField };
