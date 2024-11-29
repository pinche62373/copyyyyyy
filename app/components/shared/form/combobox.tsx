//
// Tailwind Layout via https://react-spectrum.adobe.com/react-aria/examples/user-combobox.html
//

import { forwardRef } from "react";
import React from "react";
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
import { IconChevronDown } from "#app/components/icons/icon-chevron-down";
import { cn } from "#app/utils/lib/cn";

interface MyComboBoxProps<T extends object>
  extends Omit<ComboBoxProps<T>, "children"> {
  ariaLabel: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export const ComboBox = forwardRef(
  <T extends object>(
    {
      ariaLabel,
      description,
      errorMessage,
      children,
      ...props
    }: MyComboBoxProps<T>,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <AriaComboBox
        {...props}
        className={"group flex w-full flex-col gap-1"}
        aria-label={ariaLabel}
      >
        <Group
          className={cn(
            "flex rounded-lg focus-within:ring-0",
            "focus-within:border-gray-300 dark:focus-within:border-blue-600",
            "border border-border-foreground bg-input",
          )}
        >
          <Input
            ref={ref}
            className={cn(
              "w-full flex-1 rounded-lg border-none px-3 py-2 leading-5 outline-none focus:ring-0",
              "placeholder:opacity-80 hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50",
              "bg-input text-sm font-normal text-primary-foreground",
            )}
          />

          <Button
            className={cn(
              "flex items-center rounded-r-lg border-0 border-l border-solid px-3 transition",
              "border-border-foreground",
              "bg-transparent text-secondary-foreground hover:text-primary-foreground",
            )}
          >
            {/* {isOpen ? <>&#8593;</> : <>&#8595;</>} */}
            <IconChevronDown
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
        <FieldError>{errorMessage}</FieldError>

        {/* Popover holding the items */}
        <Popover
          className={cn(
            "max-h-60 w-[--trigger-width] overflow-auto rounded-md",
            "shadow-lg ring-1 ring-black/5",
            "border border-border-foreground bg-foreground",
          )}
        >
          <ListBox>{children}</ListBox>
        </Popover>
      </AriaComboBox>
      // </div>
    );
  },
);

ComboBox.displayName = "ComboBox";
