import { ListBoxItem, ListBoxItemProps } from "react-aria-components";
import { tv } from "tailwind-variants";

export function ComboBoxItem(props: ListBoxItemProps) {
  const twListItem = tv({
    base: "w-full rounded-md px-3 py-2 text-sm font-normal text-black hover:cursor-pointer dark:text-neutral-300",
    variants: {
      state: {
        focused: "bg-gray-100 dark:bg-neutral-800",
        selected: "bg-gray-100 dark:bg-neutral-800"
      }
    }
  });

  return (
    <ListBoxItem
      {...props}
      className={({ isFocused, isSelected }) => `
              my-item ${isFocused ? twListItem({ state: "focused" }) : twListItem()} ${isSelected ? twListItem({ state: "selected" }) : twListItem()}
            `}
    />
  );
}
