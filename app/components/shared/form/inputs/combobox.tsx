//
// Tailwind Layout via https://react-spectrum.adobe.com/react-aria/examples/user-combobox.html
//

import { forwardRef } from "react";
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
  ValidationResult
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
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <AriaComboBox
        {...props}
        className={"group flex w-full flex-col gap-1"}
        aria-label={ariaLabel}
      >
        <Group
          className={cn(
            "flex rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500",
            "dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:focus-within:ring-1 dark:focus-within:ring-neutral-600"
          )}
        >
          <Input
            ref={ref}
            className={cn(
              "w-full flex-1 border-none bg-transparent px-3 py-2 text-base leading-5 text-gray-900 outline-none",
              "dark:bg-neutral-800 dark:text-neutral-300",
              "rounded-lg focus:ring-0",
              "text-sm font-normal text-black hover:cursor-pointer dark:text-neutral-300"
            )}
          />

          <Button
            className={cn(
              "flex items-center rounded-r-lg border-0 border-l border-solid bg-transparent px-3 transition",
              "border-l-gray-200 text-gray-500 hover:text-black",
              "dark:border-l-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
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
            "bg-white text-base",
            "dark:bg-neutral-900"
          )}
        >
          <ListBox>{children}</ListBox>
        </Popover>
      </AriaComboBox>
      // </div>
    );
  }
);

ComboBox.displayName = "ComboBox";
