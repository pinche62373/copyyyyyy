//
// Tailwind Layout via https://react-spectrum.adobe.com/react-aria/examples/user-combobox.html
//

import React from "react";
import { useId } from "react";
import {
  ComboBox as AriaComboBox,
  Button,
  ComboBoxProps,
  FieldError,
  Group,
  Input,
  ListBox,
  Popover,
  Text,
  ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Icon } from "#app/components/ui/icon.tsx";
import { cn } from "#app/utils/lib/cn";

const tvo = tv({
  variants: {
    container: {
      stacked: "group mb-5",
      ifta: "group relative mb-5",
    },
    group: {
      stacked: "",
      ifta: cn(
        "flex relative rounded-sm focus-within:ring-0",
        "bg-input hover:bg-input-hover",
      ),
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
        "border border-border-foreground",
        "rounded-sm border-r-0 rounded-r-none",
        "focus:border-l-4 focus:border-border-foreground focus:border-l-blue-500",
        "focus:border-l-4 focus:border-border-foreground focus:border-l-blue-500",
        "group-data-[invalid=true]:border-l-4 group-data-[invalid=true]:border-l-red-500",
        "group-data-[invalid=true]:pl-[13px]",
      ),
    },
    chevron: {
      stacked: "",
      ifta: cn(
        "flex items-center rounded-r-lg px-5 transition",
        "border border-border-foreground",
        "text-secondary-foreground hover:text-primary-foreground",
        "rounded-sm rounded-l-none",
      ),
    },
    fieldError: {
      stacked: "block pt-1 text-[90%] text-red-500 ml-1",
      ifta: cn("pt-0.5 text-[85%] text-red-500"),
    },
    popover: {
      stacked: "",
      ifta: cn(
        "max-h-60 w-[--trigger-width] overflow-auto rounded-md",
        "shadow-lg ring-1 ring-black/5",
        "border border-border-foreground bg-foreground",
      ),
    },
  },
});

interface MyComboBoxProps<T extends object>
  extends Omit<ComboBoxProps<T>, "children"> {
  ariaLabel: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export const ComboBox = <T extends object>({
  ariaLabel,
  description,
  errorMessage,
  children,
  ...rest
}: MyComboBoxProps<T>) => {
  const id = useId();

  return (
    <AriaComboBox
      validationBehavior="aria"
      {...rest}
      className={"group flex w-full flex-col gap-1 mb-5"}
      aria-label={ariaLabel}
    >
      <Group className={tvo({ group: "ifta" })}>
        <Input
          id={`input${id}`}
          aria-labelledby={`label${id}`}
          placeholder=" "
          className={cn(tvo({ input: "ifta" }))}
        />

        <label
          id={`label${id}`}
          htmlFor={`input${id}`}
          className={cn(tvo({ label: "ifta" }))}
        >
          Region
        </label>

        <Button className={tvo({ chevron: "ifta" })}>
          {/* {isOpen ? <>&#8593;</> : <>&#8595;</>} */}
          <Icon
            name="chevron-down"
            className=""
            height="20"
            width="20"
            viewBox="0 0 20 20"
            aria-hidden="true"
            focusable="false"
          />
        </Button>
      </Group>

      {description && <Text slot="description">{description}</Text>}
      <FieldError className={tvo({ fieldError: "ifta" })}>
        {errorMessage}
      </FieldError>

      {/* Popover holding the items */}
      <Popover className={tvo({ popover: "ifta" })}>
        <ListBox>{children}</ListBox>
      </Popover>
    </AriaComboBox>
  );
};

ComboBox.displayName = "ComboBox";
