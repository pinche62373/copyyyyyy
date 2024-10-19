//
// Tailwind Layout via https://react-spectrum.adobe.com/react-aria/examples/user-combobox.html
//

import {
  ComboBoxProps,
  Group,
  ValidationResult,
  Button,
  FieldError,
  Input,
  ListBox,
  Popover,
  Text,
  ComboBox as AriaComboBox
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

export function ComboBox<T extends object>({
  ariaLabel,
  description,
  errorMessage,
  children,
  ...props
}: MyComboBoxProps<T>) {
  return (
    <AriaComboBox
      {...props}
      className={"group flex w-full flex-col gap-1"}
      aria-label={ariaLabel}
    >
      <Group className="flex rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500  dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:focus-within:ring-1 dark:focus-within:ring-neutral-600">
        <Input
          className={cn(
            "w-full flex-1 border-none bg-transparent px-3 py-2 text-base leading-5 text-gray-900 outline-none",
            "dark:bg-neutral-800 dark:text-neutral-300",
            "rounded-lg focus:ring-0",
            "text-sm font-normal text-black hover:cursor-pointer dark:text-neutral-300"
          )}
        />

        <Button
          className={cn(
            "flex rounded-r-lg items-center border-0 border-l border-solid border-l-gray-200 bg-transparent px-3 text-gray-700 transition dark:border-l-neutral-700",
            "text-gray-500  hover:text-black dark:text-neutral-400  dark:hover:text-neutral-300"
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
          "entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out max-h-60 w-[--trigger-width] overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5",
          "dark:bg-neutral-900"
        )}
      >
        <ListBox>{children}</ListBox>
      </Popover>
    </AriaComboBox>
    // </div>
  );
}
